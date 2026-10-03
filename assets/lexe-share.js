/* LEXE share overlay. Loaded on first click of the notch share button. */
(function () {
  'use strict';
  if (window.lexeShare) return;
  var root = document.getElementById('lexe-share');
  if (!root) return;
  var D = root.dataset;
  var panel = root.querySelector('.ls-panel');
  var enc = encodeURIComponent;
  var ICONS = {"whatsapp":"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z","facebook":"M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z","x":"M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z","pinterest":"M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z","reddit":"M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z","telegram":"M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z","threads":"M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z","snapchat":"M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z","linkedin":"M4 9h3.5v11H4zM5.75 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h3.3v1.6c.5-.9 1.7-1.9 3.5-1.9 3.5 0 4.2 2.3 4.2 5.3V20h-3.5v-5.3c0-1.3 0-2.9-1.8-2.9s-2.2 1.4-2.2 2.8V20H10z"};
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var els = {
    tabs: root.querySelectorAll('[role=tab]'),
    lead: root.querySelector('[data-ls-lead]'),
    link: root.querySelector('[data-ls-url]'),
    copy: root.querySelector('[data-ls-copy]'),
    grid: root.querySelector('[data-ls-grid]'),
    empty: root.querySelector('[data-ls-empty]'),
    linkRow: root.querySelector('[data-ls-linkrow]'),
    note: root.querySelector('[data-ls-note]'),
    status: root.querySelector('[data-ls-status]'),
    qrs: root.querySelector('[data-ls-qrs]'),
    siteQr: root.querySelector('[data-ls-siteqr]'),
    siteBox: root.querySelector('[data-ls-sitebox]'),
    siteDl: root.querySelector('[data-ls-sitedl]'),
    cartQr: root.querySelector('[data-ls-cartqr]'),
    cartBox: root.querySelector('[data-ls-cartbox]'),
    cartDl: root.querySelector('[data-ls-cartdl]')
  };

  var state = { mode: 'site', url: '', text: '', cart: null, opener: null, open: false, token: 0 };
  var blobUrls = [];

  /* ── URLs ─────────────────────────────────────────────── */
  function siteUrl() {
    var p = location.pathname || '/';
    if (/^\/(cart|checkout|checkouts|account|orders|password)(\/|$)/i.test(p)) p = '/';
    return location.origin + p;               /* no query, no hash, no tracking params */
  }
  function cartUrl(lines) { return location.origin + '/cart/' + lines.join(',') + '?storefront=true'; }

  function loadCart() {
    return fetch('/cart.js', { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('cart'); return r.json(); })
      .then(function (c) {
        var map = {}, order = [], n = 0;
        (c.items || []).forEach(function (it) {
          if (it.properties && it.properties._lexe_gift === '1') return;   /* free gift line is added by the store */
          if (!it.variant_id || !(it.quantity > 0)) return;
          if (!(it.variant_id in map)) { map[it.variant_id] = 0; order.push(it.variant_id); }
          map[it.variant_id] += it.quantity; n += it.quantity;
        });
        return { lines: order.map(function (id) { return id + ':' + map[id]; }), count: n };
      });
  }

  /* ── Targets ─────────────────────────────────────────── */
  var T = [
    ['whatsapp', 'WhatsApp', function (u, t) { return 'https://wa.me/?text=' + enc(t + ' ' + u); }],
    ['facebook', 'Facebook', function (u) { return 'https://www.facebook.com/sharer/sharer.php?u=' + enc(u); }],
    ['x', 'X', function (u, t) { return 'https://x.com/intent/post?text=' + enc(t) + '&url=' + enc(u); }],
    ['pinterest', 'Pinterest', function (u, t) { return 'https://www.pinterest.com/pin/create/button/?url=' + enc(u) + '&description=' + enc(t); }],
    ['reddit', 'Reddit', function (u, t) { return 'https://www.reddit.com/submit?url=' + enc(u) + '&title=' + enc(t); }],
    ['linkedin', 'LinkedIn', function (u) { return 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(u); }],
    ['telegram', 'Telegram', function (u, t) { return 'https://t.me/share/url?url=' + enc(u) + '&text=' + enc(t); }],
    ['threads', 'Threads', function (u, t) { return 'https://www.threads.com/intent/post?text=' + enc(t + ' ' + u); }],
    ['snapchat', 'Snapchat', function (u) { return 'https://www.snapchat.com/scan?attachmentUrl=' + enc(u); }],
    ['email', 'Email', function (u, t) { return 'mailto:?subject=' + enc(D.mailSubject || 'LEXE') + '&body=' + enc(t + '\n\n' + u); }],
    ['sms', 'Message', function (u, t) { return 'sms:?&body=' + enc(t + ' ' + u); }]
  ];
  var STROKE = {
    email: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7.5 8 6 8-6"/>',
    sms: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V16A2.5 2.5 0 0 1 4 13.5z"/>',
    device: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>'
  };
  function svg(id) {
    if (STROKE[id]) return '<svg class="ls-stroke" viewBox="0 0 24 24" aria-hidden="true">' + STROKE[id] + '</svg>';
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[id] + '"/></svg>';
  }

  function say(msg) {
    if (!els.status) return;
    els.status.textContent = '';
    setTimeout(function () { els.status.textContent = msg; }, 30);
  }

  function renderGrid(enabled) {
    els.grid.innerHTML = '';
    function li(node) { var l = document.createElement('li'); l.appendChild(node); els.grid.appendChild(l); }
    if (navigator.share) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ls-tile'; b.setAttribute('data-ls-native', '');
      b.innerHTML = '<span class="ls-ico">' + svg('device') + '</span><span>Device share</span>';
      if (!enabled) b.setAttribute('aria-disabled', 'true');
      li(b);
    }
    T.forEach(function (t) {
      var a = document.createElement('a');
      a.className = 'ls-tile'; a.setAttribute('data-ls-target', t[0]);
      a.innerHTML = '<span class="ls-ico">' + svg(t[0]) + '</span><span>' + t[1] + '</span>';
      if (enabled) {
        a.href = t[2](state.url, state.text);
        if (t[0] !== 'email' && t[0] !== 'sms') { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      } else { a.setAttribute('aria-disabled', 'true'); a.setAttribute('tabindex', '-1'); a.removeAttribute('href'); }
      a.setAttribute('aria-label', (t[0] === 'email' || t[0] === 'sms' ? 'Share by ' : 'Share on ') + t[1]);
      li(a);
    });
  }

  /* ── QR (only the cart QR is generated here; the home QR is a static file) ── */
  function loadQrLib() {
    if (window.lexeQrcode) return Promise.resolve();
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = D.qrJs; s.async = true; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  function qrSvg(text) {
    var q = window.lexeQrcode(0, text.length > 80 ? 'M' : 'Q');
    q.addData(text, 'Byte'); q.make();
    var n = q.getModuleCount(), qz = 4, S = n + 2 * qz, d = '';
    for (var r = 0; r < n; r++) {
      var c = 0;
      while (c < n) {
        if (q.isDark(r, c)) { var s = c; while (c < n && q.isDark(r, c)) c++; d += 'M' + (s + qz) + ' ' + (r + qz) + 'h' + (c - s) + 'v1h-' + (c - s) + 'z'; }
        else c++;
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + S + ' ' + S + '" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="' + S + '" height="' + S + '" fill="#fff"/><path fill="#000" d="' + d + '"/></svg>';
  }
  function blobLink(a, markup, name) {
    try {
      var u = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
      blobUrls.push(u); a.href = u; a.setAttribute('download', name);
    } catch (e) { a.hidden = true; }
  }
  function revokeBlobs() { blobUrls.splice(0).forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) {} }); }

  function renderSiteQr() {
    var homeUrl = D.qrUrl;
    if (D.qrStatic === 'true') return;           /* static SVG already in the markup */
    loadQrLib().then(function () {
      var m = qrSvg(homeUrl);
      els.siteBox.innerHTML = m; els.siteBox.removeAttribute('hidden');
      blobLink(els.siteDl, m, 'lexe-qr.svg');
    }).catch(function () { els.siteQr.hidden = true; });
  }

  function renderCartQr(url, ok) {
    var two = false;
    if (!ok) { els.cartQr.hidden = true; }
    else {
      loadQrLib().then(function () {
        if (state.mode !== 'cart' || state.url !== url) return;
        var m = qrSvg(url);
        els.cartBox.innerHTML = m; blobLink(els.cartDl, m, 'lexe-cart-qr.svg');
        els.cartQr.hidden = false; els.qrs.classList.add('has-two');
      }).catch(function () { els.cartQr.hidden = true; });
    }
    if (!ok) els.qrs.classList.remove('has-two');
  }

  /* ── Render by tab ───────────────────────────────────── */
  function setTab(mode, focus) {
    state.mode = mode;
    var bd = root.querySelector('#ls-body'); if (bd) bd.setAttribute('aria-labelledby', 'ls-tab-' + mode);
    Array.prototype.forEach.call(els.tabs, function (t) {
      var on = t.getAttribute('data-ls-tab') === mode;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    render();
  }

  function render() {
    var token = ++state.token;
    els.cartQr.hidden = true; els.qrs.classList.remove('has-two');
    els.empty.hidden = true; els.linkRow.hidden = false;
    if (state.mode === 'site') {
      state.url = siteUrl(); state.text = D.text || '';
      els.lead.textContent = D.leadSite;
      els.note.textContent = D.hint;
      els.link.value = state.url;
      els.copy.disabled = false;
      renderGrid(true);
      return;
    }
    els.lead.textContent = D.leadCart;
    els.note.textContent = D.cartNote;
    els.link.value = ''; els.copy.disabled = true;
    state.url = ''; state.text = D.cartText || D.text || '';
    renderGrid(false);
    loadCart().then(function (c) {
      if (token !== state.token) return;
      state.cart = c;
      if (!c.lines.length) {
        els.empty.hidden = false; els.linkRow.hidden = true; renderCartQr('', false);
        return;
      }
      state.url = cartUrl(c.lines);
      els.link.value = state.url; els.copy.disabled = false;
      renderGrid(true);
      renderCartQr(state.url, true);
    }).catch(function () {
      if (token !== state.token) return;
      els.empty.textContent = D.cartError; els.empty.hidden = false; els.linkRow.hidden = true;
    });
  }

  /* ── Copy ─────────────────────────────────────────────── */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      panel.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      panel.removeChild(ta); ok ? res() : rej();
    });
  }
  var copyTimer;
  function doCopy() {
    if (!state.url) return;
    copyText(state.url).then(function () {
      els.copy.textContent = D.copiedLabel; els.copy.classList.add('is-done'); say(D.copiedLabel);
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () { els.copy.textContent = D.copyLabel; els.copy.classList.remove('is-done'); }, 2000);
    }).catch(function () { els.link.focus(); els.link.select(); say(D.copyFail); });
  }

  /* ── Open / close / focus trap ───────────────────────── */
  function focusables() {
    return Array.prototype.filter.call(panel.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])'), function (n) {
      return !n.hidden && !n.closest('[hidden]') && n.offsetParent !== null && n.getAttribute('aria-disabled') !== 'true';
    });
  }
  function open(opener, mode) {
    if (state.open) return;
    state.open = true; state.opener = opener || document.activeElement;
    root.hidden = false;
    document.documentElement.classList.add('lexe-share-lock');
    setTab(mode || 'site', false);
    renderSiteQr();
    requestAnimationFrame(function () {
      root.classList.add('is-open');
      var x = panel.querySelector('[data-ls-close]'); (els.tabs[0] && root.querySelector('[role=tab][aria-selected=true]') || x).focus({ preventScroll: true });
    });
    document.addEventListener('keydown', onKey, true);
  }
  function close() {
    if (!state.open) return;
    state.open = false; state.token++;
    document.removeEventListener('keydown', onKey, true);
    root.classList.remove('is-open');
    var done = function () {
      root.hidden = true; document.documentElement.classList.remove('lexe-share-lock'); revokeBlobs();
      returnFocus();
    };
    if (reduce) done(); else setTimeout(done, 280);
  }
  function visible(n) { return n && n.offsetParent !== null && n.getAttribute('aria-hidden') !== 'true' && n.offsetHeight > 4; }
  function returnFocus() {
    var o = state.opener;
    if (!visible(o)) {
      var nt = document.querySelector('[data-apex-notch]');
      o = nt && (nt.querySelector('[data-notch-expand]') || nt.querySelector('.notch-lobe--primary'));
    }
    if (o && o.focus) { try { o.focus({ preventScroll: true }); } catch (e) {} }
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = focusables(); if (!f.length) return;
    var first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (!panel.contains(a)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  }

  root.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-ls-close]') || t.classList.contains('ls-backdrop') || t === root) { close(); return; }
    var tab = t.closest('[role=tab]'); if (tab) { setTab(tab.getAttribute('data-ls-tab'), false); return; }
    if (t.closest('[data-ls-copy]')) { doCopy(); return; }
    var nat = t.closest('[data-ls-native]');
    if (nat && state.url && navigator.share) {
      navigator.share({ title: D.mailSubject || 'LEXE', text: state.text, url: state.url }).catch(function () {});
      return;
    }
    var a = t.closest('a.ls-tile[aria-disabled=true]'); if (a) e.preventDefault();
  });
  root.querySelector('[role=tablist]').addEventListener('keydown', function (e) {
    var keys = { ArrowLeft: -1, ArrowRight: 1, Home: 'first', End: 'last' };
    if (!(e.key in keys)) return;
    e.preventDefault();
    var arr = Array.prototype.slice.call(els.tabs), i = arr.indexOf(document.activeElement);
    var j = keys[e.key] === 'first' ? 0 : keys[e.key] === 'last' ? arr.length - 1 : (i + keys[e.key] + arr.length) % arr.length;
    setTab(arr[j].getAttribute('data-ls-tab'), true);
  });
  els.link.addEventListener('focus', function () { els.link.select(); });

  window.lexeShare = { open: open, close: close };
  document.dispatchEvent(new CustomEvent('lexe-share:ready'));
})();
