import { Component } from '@theme/component';
import { oncePerEditorSession } from '@theme/utilities';

/**
 * LEXE image compare slider.
 *
 * Position model: `pos` (0-100) is how much of the "before" image is visible, measured from the
 * left edge (horizontal) or the top edge (vertical). The divider sits at `pos`.
 * Input: pointer events (mouse, touch, pen) plus keyboard on the handle (role="slider").
 * Touch: the wrapper uses touch-action pan-y (or pan-x when vertical) so page scrolling still works.
 *
 * @typedef {object} ComparisonSliderRefs
 * @property {HTMLElement} mediaWrapper - Container that holds the layers
 * @property {HTMLElement} slider - The handle (role="slider")
 * @property {HTMLElement} afterImage - The image that gets revealed
 *
 * @extends {Component<ComparisonSliderRefs>}
 */
export class ComparisonSliderComponent extends Component {
  requiredRefs = ['mediaWrapper', 'slider', 'afterImage'];

  constructor() {
    super();
    this.hasAnimated = false;
    this.dragging = false;
    this.pending = null;
    this.pos = 50;
    this.start = 50;
    this.hintFrame = 0;
    this.smoothTimer = 0;
    this.boundHandleIntersection = this.handleIntersection.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    const { mediaWrapper, slider } = this.refs;
    this.orientation = mediaWrapper.dataset.orientation === 'vertical' ? 'vertical' : 'horizontal';
    this.beforeLabel = mediaWrapper.dataset.beforeLabel || 'Before';
    this.afterLabel = mediaWrapper.dataset.afterLabel || 'After';

    const start = Number(mediaWrapper.dataset.start);
    this.start = Number.isFinite(start) ? Math.min(100, Math.max(0, start)) : 50;
    this.setPosition(this.start);

    mediaWrapper.addEventListener('pointerdown', this.onPointerDown);
    mediaWrapper.addEventListener('pointermove', this.onPointerMove);
    mediaWrapper.addEventListener('pointerup', this.onPointerUp);
    mediaWrapper.addEventListener('pointercancel', this.onPointerUp);
    mediaWrapper.addEventListener('lostpointercapture', this.onPointerUp);
    mediaWrapper.addEventListener('dragstart', (e) => e.preventDefault());
    slider.addEventListener('keydown', this.onKeyDown);

    if (mediaWrapper.dataset.hint === 'true') this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) super.disconnectedCallback();
    if (this.intersectionObserver) this.intersectionObserver.disconnect();
    cancelAnimationFrame(this.hintFrame);
    clearTimeout(this.smoothTimer);
    const { mediaWrapper, slider } = this.refs;
    if (mediaWrapper) {
      mediaWrapper.removeEventListener('pointerdown', this.onPointerDown);
      mediaWrapper.removeEventListener('pointermove', this.onPointerMove);
      mediaWrapper.removeEventListener('pointerup', this.onPointerUp);
      mediaWrapper.removeEventListener('pointercancel', this.onPointerUp);
      mediaWrapper.removeEventListener('lostpointercapture', this.onPointerUp);
    }
    if (slider) slider.removeEventListener('keydown', this.onKeyDown);
  }

  /**
   * Set the divider position and keep the ARIA state in step.
   * @param {number} value - 0-100 (0 = all after, 100 = all before)
   * @param {{smooth?: boolean}} [opts]
   */
  setPosition(value, opts = {}) {
    const { mediaWrapper, slider } = this.refs;
    if (!mediaWrapper || !slider) return;

    const pos = Math.min(100, Math.max(0, Number(value)));
    this.pos = pos;

    if (opts.smooth) {
      mediaWrapper.setAttribute('data-smooth', '');
      clearTimeout(this.smoothTimer);
      this.smoothTimer = setTimeout(() => mediaWrapper.removeAttribute('data-smooth'), 260);
    }

    mediaWrapper.style.setProperty('--pos', pos.toFixed(2));
    const before = Math.round(pos);
    slider.setAttribute('aria-valuenow', String(before));
    slider.setAttribute('aria-valuetext', `${before}% ${this.beforeLabel}, ${100 - before}% ${this.afterLabel}`);
  }

  /** Kept for compatibility with the previous API. */
  setValue(value) {
    this.setPosition(value);
  }

  /** @param {PointerEvent} e */
  coordToPos(e) {
    const rect = this.refs.mediaWrapper.getBoundingClientRect();
    if (this.orientation === 'vertical') return ((e.clientY - rect.top) / rect.height) * 100;
    return ((e.clientX - rect.left) / rect.width) * 100;
  }

  /** Distance in px between the pointer and the divider. */
  distanceToDivider(e) {
    const rect = this.refs.mediaWrapper.getBoundingClientRect();
    const size = this.orientation === 'vertical' ? rect.height : rect.width;
    const c = this.orientation === 'vertical' ? e.clientY - rect.top : e.clientX - rect.left;
    return Math.abs(c - (this.pos / 100) * size);
  }

  beginDrag(e, offset) {
    this.dragging = true;
    this.dragOffset = offset;
    this.pending = null;
    this.stopHint();
    const { mediaWrapper } = this.refs;
    mediaWrapper.classList.add('is-dragging');
    try {
      mediaWrapper.setPointerCapture(e.pointerId);
    } catch (_) {
      /* pointer already released */
    }
  }

  /** @param {PointerEvent} e */
  onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.stopHint();
    const isTouch = e.pointerType === 'touch';
    const near = this.distanceToDivider(e) <= 36 || e.target.closest?.('.cs-slider__handle');

    if (!isTouch) {
      // Mouse and pen: grab anywhere, divider follows the pointer
      this.beginDrag(e, 0);
      this.setPosition(this.coordToPos(e), { smooth: !near });
      return;
    }
    if (near) {
      // Touch on the handle: keep the grab offset so nothing jumps
      this.beginDrag(e, this.pos - this.coordToPos(e));
      return;
    }
    // Touch elsewhere: wait to see if it is a tap or a sideways drag, so vertical scrolling is never hijacked
    this.pending = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
  }

  /** @param {PointerEvent} e */
  onPointerMove(e) {
    if (this.dragging) {
      this.setPosition(this.coordToPos(e) + this.dragOffset);
      return;
    }
    const p = this.pending;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    const along = this.orientation === 'vertical' ? dy : dx;
    const across = this.orientation === 'vertical' ? dx : dy;
    if (Math.abs(along) > 8 && Math.abs(along) > Math.abs(across)) {
      this.beginDrag(e, 0);
      this.setPosition(this.coordToPos(e));
    }
  }

  /** @param {PointerEvent} e */
  onPointerUp(e) {
    const p = this.pending;
    if (p && e.type === 'pointerup' && p.id === e.pointerId) {
      const moved = Math.hypot(e.clientX - p.x, e.clientY - p.y);
      if (moved < 8 && performance.now() - p.t < 450) this.setPosition(this.coordToPos(e), { smooth: true });
    }
    this.pending = null;
    if (!this.dragging) return;
    this.dragging = false;
    const { mediaWrapper } = this.refs;
    mediaWrapper.classList.remove('is-dragging');
    try {
      if (mediaWrapper.hasPointerCapture(e.pointerId)) mediaWrapper.releasePointerCapture(e.pointerId);
    } catch (_) {
      /* ignore */
    }
  }

  /** @param {KeyboardEvent} e */
  onKeyDown(e) {
    const vertical = this.orientation === 'vertical';
    const step = e.shiftKey ? 10 : 2;
    let next = null;
    switch (e.key) {
      case 'ArrowLeft':
        next = this.pos - step;
        break;
      case 'ArrowRight':
        next = this.pos + step;
        break;
      case 'ArrowUp':
        next = vertical ? this.pos - step : this.pos + step;
        break;
      case 'ArrowDown':
        next = vertical ? this.pos + step : this.pos - step;
        break;
      case 'PageUp':
        next = this.pos + 10;
        break;
      case 'PageDown':
        next = this.pos - 10;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = 100;
        break;
      default:
        return;
    }
    e.preventDefault();
    this.stopHint();
    this.setPosition(next, { smooth: true });
  }

  stopHint() {
    if (this.hintFrame) cancelAnimationFrame(this.hintFrame);
    this.hintFrame = 0;
    this.hasAnimated = true;
  }

  /** Small back-and-forth around the start position to show that the handle moves. */
  animateHint() {
    if (this.hasAnimated) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (this.start < 15 || this.start > 85) return;
    this.hasAnimated = true;

    const keyframes = [this.start, this.start - 9, this.start + 9, this.start];
    const seg = 480;
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const tick = (now) => {
      const elapsed = now - t0;
      const i = Math.min(keyframes.length - 2, Math.floor(elapsed / seg));
      const local = Math.min(1, (elapsed - i * seg) / seg);
      this.setPosition(keyframes[i] + (keyframes[i + 1] - keyframes[i]) * ease(local));
      if (elapsed < seg * (keyframes.length - 1)) this.hintFrame = requestAnimationFrame(tick);
      else {
        this.hintFrame = 0;
        this.setPosition(this.start);
      }
    };
    this.hintFrame = requestAnimationFrame(tick);
  }

  setupIntersectionObserver() {
    if (!window.IntersectionObserver) return;
    this.intersectionObserver = new IntersectionObserver(this.boundHandleIntersection, { threshold: 0.6 });
    this.intersectionObserver.observe(this);
  }

  /** @param {IntersectionObserverEntry[]} entries */
  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || this.hasAnimated) return;
      setTimeout(() => {
        oncePerEditorSession(this, 'comparison-slider-animated', () => this.animateHint());
      }, 300);
      if (this.intersectionObserver) this.intersectionObserver.disconnect();
    });
  }
}

if (!customElements.get('comparison-slider-component')) {
  customElements.define('comparison-slider-component', ComparisonSliderComponent);
}
