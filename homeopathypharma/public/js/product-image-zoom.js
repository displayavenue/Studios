(function () {
  'use strict';

  function closest(el, sel) {
    return el && el.closest ? el.closest(sel) : null;
  }

  function initGallery(root) {
    var stage = root.querySelector('[data-hp-zoom-stage]');
    var mainImg = root.querySelector('[data-hp-zoom-main]');
    var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-hp-zoom-thumb]'));
    var openBtn = root.querySelector('[data-hp-zoom-open]');
    if (!stage || !mainImg) return;

    function setActive(btn) {
      thumbs.forEach(function (t) {
        t.classList.toggle('is-active', t === btn);
        t.setAttribute('aria-pressed', t === btn ? 'true' : 'false');
      });
      var url = btn.getAttribute('data-full') || btn.querySelector('img')?.getAttribute('src');
      var alt = btn.querySelector('img')?.getAttribute('alt') || mainImg.getAttribute('alt') || '';
      if (url) {
        mainImg.setAttribute('src', url);
        mainImg.setAttribute('data-full', url);
        mainImg.setAttribute('alt', alt);
      }
    }

    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setActive(btn);
      });
    });

    function openLightbox(startUrl) {
      var urls = thumbs.length
        ? thumbs.map(function (t) {
            return t.getAttribute('data-full') || t.querySelector('img')?.getAttribute('src');
          }).filter(Boolean)
        : [startUrl || mainImg.getAttribute('data-full') || mainImg.getAttribute('src')].filter(Boolean);
      if (!urls.length) return;

      var index = Math.max(0, urls.indexOf(startUrl || mainImg.getAttribute('src')));
      if (index < 0) index = 0;

      var overlay = document.createElement('div');
      overlay.className = 'hp-zoom-lightbox';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Zoomed product image');
      overlay.innerHTML =
        '<button type="button" class="hp-zoom-lightbox__close" data-hp-zoom-close aria-label="Close">×</button>' +
        '<button type="button" class="hp-zoom-lightbox__nav hp-zoom-lightbox__nav--prev" data-hp-zoom-prev aria-label="Previous image">‹</button>' +
        '<button type="button" class="hp-zoom-lightbox__nav hp-zoom-lightbox__nav--next" data-hp-zoom-next aria-label="Next image">›</button>' +
        '<div class="hp-zoom-lightbox__viewport" data-hp-zoom-viewport>' +
        '  <img class="hp-zoom-lightbox__img" data-hp-zoom-img alt="">' +
        '</div>' +
        '<p class="hp-zoom-lightbox__hint">Pinch or scroll to zoom · drag to pan · tap × to close</p>';

      document.body.appendChild(overlay);
      document.body.classList.add('hp-zoom-open');

      var img = overlay.querySelector('[data-hp-zoom-img]');
      var viewport = overlay.querySelector('[data-hp-zoom-viewport]');
      var scale = 1;
      var tx = 0;
      var ty = 0;
      var pointers = new Map();
      var lastDist = 0;
      var panning = false;
      var panStart = { x: 0, y: 0, tx: 0, ty: 0 };

      function applyTransform() {
        img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
      }

      function resetTransform() {
        scale = 1;
        tx = 0;
        ty = 0;
        applyTransform();
      }

      function show(i) {
        index = (i + urls.length) % urls.length;
        img.setAttribute('src', urls[index]);
        resetTransform();
      }

      show(index);

      function close() {
        document.body.classList.remove('hp-zoom-open');
        overlay.remove();
        window.removeEventListener('keydown', onKey);
      }

      function onKey(e) {
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') show(index + 1);
        if (e.key === 'ArrowLeft') show(index - 1);
      }
      window.addEventListener('keydown', onKey);

      overlay.querySelector('[data-hp-zoom-close]').addEventListener('click', close);
      overlay.querySelector('[data-hp-zoom-prev]').addEventListener('click', function () { show(index - 1); });
      overlay.querySelector('[data-hp-zoom-next]').addEventListener('click', function () { show(index + 1); });
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });

      viewport.addEventListener('wheel', function (e) {
        e.preventDefault();
        var delta = e.deltaY > 0 ? -0.12 : 0.12;
        scale = Math.min(4, Math.max(1, scale + delta));
        if (scale === 1) {
          tx = 0;
          ty = 0;
        }
        applyTransform();
      }, { passive: false });

      viewport.addEventListener('pointerdown', function (e) {
        viewport.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size === 1) {
          panning = true;
          panStart = { x: e.clientX, y: e.clientY, tx: tx, ty: ty };
        } else if (pointers.size === 2) {
          panning = false;
          var pts = Array.from(pointers.values());
          lastDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        }
      });

      viewport.addEventListener('pointermove', function (e) {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size === 2) {
          var pts = Array.from(pointers.values());
          var dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          if (lastDist > 0) {
            scale = Math.min(4, Math.max(1, scale * (dist / lastDist)));
            if (scale === 1) {
              tx = 0;
              ty = 0;
            }
            applyTransform();
          }
          lastDist = dist;
        } else if (panning && scale > 1) {
          tx = panStart.tx + (e.clientX - panStart.x);
          ty = panStart.ty + (e.clientY - panStart.y);
          applyTransform();
        }
      });

      function endPointer(e) {
        pointers.delete(e.pointerId);
        if (pointers.size < 2) lastDist = 0;
        if (pointers.size === 0) panning = false;
      }
      viewport.addEventListener('pointerup', endPointer);
      viewport.addEventListener('pointercancel', endPointer);

      img.addEventListener('dblclick', function () {
        if (scale > 1) resetTransform();
        else {
          scale = 2.2;
          applyTransform();
        }
      });
    }

    function openFromMain() {
      openLightbox(mainImg.getAttribute('data-full') || mainImg.getAttribute('src'));
    }

    stage.addEventListener('click', openFromMain);
    if (openBtn) openBtn.addEventListener('click', openFromMain);
    mainImg.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openFromMain();
      }
    });
  }

  document.querySelectorAll('[data-hp-product-gallery]').forEach(initGallery);
})();
