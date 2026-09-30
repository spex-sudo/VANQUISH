(function () {
  'use strict';
  if (window.__vqscBooted) return;
  window.__vqscBooted = true;

  function boot(root) {
    if (!root || root.getAttribute('data-booted')) return;
    root.setAttribute('data-booted', '1');

    var sid = root.id.replace('vqsc-', '');
    var mode = root.getAttribute('data-mode') || 'overlay';
    var editor = root.getAttribute('data-editor') === '1';
    var SK = 'vqsc_d_' + sid;
    var VK = 'vqsc_v_' + sid;
    var threshold = Math.max(20, Math.min(90, parseInt(root.getAttribute('data-threshold'), 10) || 52)) / 100;
    var brush = parseInt(root.getAttribute('data-brush'), 10) || 42;
    var dismissDays = parseInt(root.getAttribute('data-dismiss'), 10) || 14;
    var trigger = root.getAttribute('data-trigger') || 'delay';
    var delay = (parseFloat(root.getAttribute('data-delay')) || 1) * 1000;
    var scrollPct = parseInt(root.getAttribute('data-scroll'), 10) || 20;
    var keepCopy = root.getAttribute('data-keep') || 'KEEP SCRATCHING';
    var claimedCopy = root.getAttribute('data-claimed') || 'CLAIMED!';
    var foilA = root.getAttribute('data-foil-a') || '#f3d36a';
    var foilB = root.getAttribute('data-foil-b') || '#c9a227';
    var pullNeed = parseInt(root.getAttribute('data-pull'), 10) || 56;
    var tagSide = (root.getAttribute('data-tag-side') || 'right');

    var canvas = root.querySelector('[data-canvas]');
    var foilLabel = root.querySelector('[data-foil-label]');
    var progressEl = root.querySelector('[data-progress]');
    var form = root.querySelector('form');
    var tag = root.querySelector('.vqsc-tag');
    var foilWrap = root.querySelector('[data-foil]');
    var opened = false;
    var revealed = false;
    var scratchedOnce = false;
    var ctx = null;
    var lastX = 0, lastY = 0, drawing = false;
    var sampleTick = 0;

    function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

    function dismissed() {
      if (editor) return false;
      if (get(VK) === '1') return true;
      var raw = get(SK);
      if (!raw) return false;
      var ts = parseInt(raw, 10);
      if (!ts) return false;
      return (Date.now() - ts) < dismissDays * 86400000;
    }

    function markDismiss() { set(SK, String(Date.now())); }
    function markWon() { set(VK, '1'); set(SK, String(Date.now())); }

    function view(name) {
      root.querySelectorAll('[data-view]').forEach(function (v) {
        v.classList.toggle('is-on', v.getAttribute('data-view') === name);
      });
    }

    function lock(on) {
      if (mode === 'page') return;
      document.body.classList.toggle('vqsc-lock-' + sid, on);
    }

    function openStage() {
      if (opened) return;
      opened = true;
      root.classList.add('is-open');
      lock(true);
      requestAnimationFrame(initCanvas);
    }

    function closeStage() {
      if (mode === 'page') return;
      root.classList.remove('is-open');
      lock(false);
      if (!revealed) markDismiss();
      opened = false;
      if (tag) {
        tag.classList.remove('is-pulling');
        tag.style.transform = '';
      }
      document.documentElement.classList.remove('vqsc-pull-lock');
      document.body.classList.remove('vqsc-pull-lock');
    }

    function setupCanvasSize() {
      if (!canvas) return false;
      var rect = canvas.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) return false;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
      if (!ctx) return false;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil(rect.width, rect.height);
      return true;
    }

    function paintFoil(w, h) {
      var g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, foilA);
      g.addColorStop(0.5, foilB);
      g.addColorStop(1, foilA);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      for (var x = 0; x < w + h; x += 20) ctx.fillRect(x, 0, 10, h);
    }

    function initCanvas() {
      if (!canvas || canvas.getAttribute('data-ready')) return;
      if (!setupCanvasSize()) return;
      canvas.setAttribute('data-ready', '1');
      if (foilWrap) foilWrap.classList.add('is-live');
      bindScratch();
    }

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      var t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    }

    function scratchTo(x, y, first) {
      if (!ctx) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = brush;
      ctx.beginPath();
      if (first) ctx.moveTo(x, y);
      else ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, brush * 0.45, 0, Math.PI * 2);
      ctx.fill();
      lastX = x;
      lastY = y;
    }

    function clearedRatio() {
      if (!ctx) return 0;
      var step = 8;
      var w = canvas.width, h = canvas.height;
      var data;
      try { data = ctx.getImageData(0, 0, w, h).data; } catch (e) { return 0; }
      var clear = 0, total = 0;
      for (var y = 0; y < h; y += step) {
        for (var x = 0; x < w; x += step) {
          total++;
          if (data[(y * w + x) * 4 + 3] < 48) clear++;
        }
      }
      return total ? clear / total : 0;
    }

    function updateProgress(force) {
      sampleTick++;
      if (!force && sampleTick % 4 !== 0) return;
      var ratio = clearedRatio();
      var pct = Math.min(100, Math.round(ratio * 100));
      if (progressEl) progressEl.textContent = pct + '% CLEARED \u00b7 ' + keepCopy;
      if (pct >= 8 && foilLabel) foilLabel.classList.add('is-hide');
      if (ratio >= threshold) finishScratch();
    }

    function finishScratch() {
      if (revealed) return;
      revealed = true;
      if (foilWrap) foilWrap.style.opacity = '0';
      if (progressEl) progressEl.textContent = '100% CLEARED';
      setTimeout(function () { view('claim'); }, 280);
    }

    function bindScratch() {
      if (!canvas) return;
      var start = function (e) {
        if (revealed) return;
        e.preventDefault();
        drawing = true;
        canvas.classList.add('is-down');
        var p = pos(e);
        scratchTo(p.x, p.y, true);
        if (!scratchedOnce) {
          scratchedOnce = true;
          if (foilLabel) foilLabel.classList.add('is-hide');
        }
      };
      var move = function (e) {
        if (!drawing || revealed) return;
        e.preventDefault();
        var p = pos(e);
        scratchTo(p.x, p.y, false);
        updateProgress(false);
      };
      var end = function () {
        if (!drawing) return;
        drawing = false;
        canvas.classList.remove('is-down');
        updateProgress(true);
      };
      canvas.addEventListener('pointerdown', start, { passive: false });
      canvas.addEventListener('pointermove', move, { passive: false });
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
    }

    function bindPull(el) {
      if (!el) return;
      var startX = 0;
      var pulled = 0;
      var active = false;
      var moved = false;
      var pid = null;
      var baseW = 0;
      var navOpts = { passive: false, capture: true };

      function eat(e) {
        if (e && e.cancelable) e.preventDefault();
        if (e) e.stopPropagation();
      }

      function lockNav(on) {
        document.documentElement.classList.toggle('vqsc-pull-lock', on);
        document.body.classList.toggle('vqsc-pull-lock', on);
      }

      function onDocTouch(e) {
        if (!active) return;
        eat(e);
      }

      function inward(dx) {
        if (tagSide === 'left') return Math.max(0, dx);
        return Math.max(0, -dx);
      }

      function apply(px) {
        var cap = pullNeed * 1.45;
        var extra = Math.min(px, cap);
        var w = baseW || el.offsetWidth || 36;
        var sx = 1 + extra / w;
        var sy = Math.max(0.88, 1 - extra / 520);
        el.style.transform = 'translateY(-50%) scale(' + sx + ',' + sy + ')';
      }

      function armDoc(on) {
        var fn = on ? 'addEventListener' : 'removeEventListener';
        document[fn]('touchstart', onDocTouch, navOpts);
        document[fn]('touchmove', onDocTouch, navOpts);
        document[fn]('touchend', onDocTouch, navOpts);
        document[fn]('pointermove', onDocTouch, navOpts);
        document[fn]('gesturestart', onDocTouch, navOpts);
      }

      function reset() {
        el.classList.remove('is-pulling');
        el.style.transform = '';
        active = false;
        pulled = 0;
        pid = null;
        lockNav(false);
        armDoc(false);
      }

      el.addEventListener('pointerdown', function (e) {
        if (opened || root.getAttribute('data-done') === 'true') return;
        eat(e);
        active = true;
        moved = false;
        pulled = 0;
        pid = e.pointerId;
        startX = e.clientX;
        baseW = el.offsetWidth || 36;
        el.classList.add('is-pulling');
        lockNav(true);
        armDoc(true);
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
      }, { passive: false });

      el.addEventListener('pointermove', function (e) {
        if (!active || (pid != null && e.pointerId !== pid)) return;
        eat(e);
        var dx = e.clientX - startX;
        pulled = inward(dx);
        if (pulled > 6) moved = true;
        apply(pulled);
        if (pulled >= pullNeed) {
          active = false;
          try { el.releasePointerCapture(e.pointerId); } catch (err) {}
          el.classList.remove('is-pulling');
          el.style.transform = '';
          lockNav(false);
          armDoc(false);
          openStage();
        }
      }, { passive: false });

      function endPull(e) {
        if (!active) return;
        eat(e);
        active = false;
        try { if (e && e.pointerId != null) el.releasePointerCapture(e.pointerId); } catch (err) {}
        lockNav(false);
        armDoc(false);
        if (pulled >= pullNeed) {
          el.style.transform = '';
          el.classList.remove('is-pulling');
          openStage();
          return;
        }
        var wasMoved = moved;
        reset();
        if (!wasMoved) openStage();
      }

      el.addEventListener('pointerup', endPull, { passive: false });
      el.addEventListener('pointercancel', endPull, { passive: false });
      el.addEventListener('touchstart', eat, { passive: false });
      el.addEventListener('touchmove', eat, { passive: false });
      el.addEventListener('click', function (e) { e.preventDefault(); });
    }

    if (mode === 'tag') bindPull(tag);
    else {
      root.querySelectorAll('[data-vqsc-open]').forEach(function (btn) {
        btn.addEventListener('click', openStage);
      });
    }

    root.querySelectorAll('[data-vqsc-close]').forEach(function (btn) {
      btn.addEventListener('click', closeStage);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('is-open')) closeStage();
    });

    var skip = root.querySelector('[data-skip]');
    if (skip) skip.addEventListener('click', finishScratch);

    var claim = root.querySelector('[data-claim]');
    if (claim) {
      claim.addEventListener('click', function () {
        claim.textContent = claimedCopy;
        setTimeout(function () {
          view('email');
          var em = root.querySelector('[data-email]');
          if (em) em.focus();
        }, 220);
      });
    }

    var copyBtn = root.querySelector('[data-copy]');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var code = root.querySelector('[data-code]');
        if (!code || !navigator.clipboard) return;
        navigator.clipboard.writeText(code.textContent.trim()).then(function () {
          copyBtn.textContent = 'Copied';
        });
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var hp = form.querySelector('input[name="contact[website]"]');
        if (hp && hp.value) return;
        var email = root.querySelector('[data-email]');
        var err = root.querySelector('[data-error]');
        if (!email || !email.value || !/[^\s@]+@[^\s@]+\.[^\s@]+/.test(email.value)) {
          if (err) { err.textContent = 'Enter a valid email.'; err.classList.add('is-on'); }
          if (email) email.focus();
          return;
        }
        var btn = root.querySelector('[data-submit]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }
        var body = new URLSearchParams(new FormData(form));
        fetch(form.getAttribute('action') || '/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
          body: body.toString()
        }).then(function () {
          markWon();
          view('success');
          if (mode === 'tag') root.setAttribute('data-done', 'true');
        }).catch(function () {
          markWon();
          view('success');
        });
      });
    }

    function armOverlay() {
      if (mode === 'page' || mode === 'tag') return;
      if (dismissed()) return;
      if (trigger === 'immediate') { openStage(); return; }
      if (trigger === 'delay') { setTimeout(openStage, delay); return; }
      if (trigger === 'scroll') {
        var onScroll = function () {
          var doc = document.documentElement;
          var max = doc.scrollHeight - window.innerHeight;
          var pct = max > 0 ? (window.scrollY / max) * 100 : 100;
          if (pct >= scrollPct) {
            window.removeEventListener('scroll', onScroll);
            openStage();
          }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return;
      }
      if (trigger === 'exit') {
        document.addEventListener('mouseout', function onOut(e) {
          if (e.clientY > 8) return;
          document.removeEventListener('mouseout', onOut);
          openStage();
        });
      }
    }

    if (mode === 'page') {
      opened = true;
      requestAnimationFrame(initCanvas);
    } else if (editor && mode !== 'tag') {
      openStage();
    } else {
      armOverlay();
    }
  }

  function bootAll() {
    document.querySelectorAll('.vqsc[id^="vqsc-"]').forEach(boot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }
  document.addEventListener('shopify:section:load', function (e) {
    if (!e.target) return;
    var found = e.target.querySelector('.vqsc[id^="vqsc-"]') || (e.target.classList && e.target.classList.contains('vqsc') ? e.target : null);
    if (found) boot(found);
  });
})();
