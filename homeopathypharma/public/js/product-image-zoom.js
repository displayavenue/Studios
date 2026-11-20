(function () {
  'use strict';

  function initGallery(root) {
    var stage = root.querySelector('[data-hp-zoom-stage]');
    var mainImg = root.querySelector('[data-hp-zoom-main]');
    var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-hp-zoom-thumb]'));
    if (!stage || !mainImg) return;

    function setActive(btn) {
      thumbs.forEach(function (t) {
        t.classList.toggle('is-active', t === btn);
        t.setAttribute('aria-pressed', t === btn ? 'true' : 'false');
      });
      var thumbImg = btn.querySelector('img');
      var url = btn.getAttribute('data-full') || (thumbImg ? thumbImg.getAttribute('src') : null);
      var alt = (thumbImg && thumbImg.getAttribute('alt')) || mainImg.getAttribute('alt') || '';
      if (url) {
        mainImg.setAttribute('src', url);
        mainImg.setAttribute('data-full', url);
        mainImg.setAttribute('alt', alt);
        resetZoom();
      }
    }

    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setActive(btn);
      });
    });

    function resetZoom() {
      stage.classList.remove('is-zooming');
      mainImg.style.transform = '';
      mainImg.style.transformOrigin = 'center center';
    }

    function zoomAt(clientX, clientY) {
      var rect = stage.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      var x = ((clientX - rect.left) / rect.width) * 100;
      var y = ((clientY - rect.top) / rect.height) * 100;
      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));
      stage.classList.add('is-zooming');
      mainImg.style.transformOrigin = x + '% ' + y + '%';
      mainImg.style.transform = 'scale(2.4)';
    }

    // Desktop mouse: + cursor (via CSS), zoom under pointer, reset when leaving the image.
    stage.addEventListener('mouseenter', function (e) {
      zoomAt(e.clientX, e.clientY);
    });
    stage.addEventListener('mousemove', function (e) {
      zoomAt(e.clientX, e.clientY);
    });
    stage.addEventListener('mouseleave', function () {
      resetZoom();
    });

    // Touch: press-and-move zooms under finger; lift resets.
    var touchZooming = false;
    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      touchZooming = true;
      try {
        stage.setPointerCapture(e.pointerId);
      } catch (err) {}
      zoomAt(e.clientX, e.clientY);
    });
    stage.addEventListener('pointermove', function (e) {
      if (!touchZooming || e.pointerType === 'mouse') return;
      zoomAt(e.clientX, e.clientY);
    });
    function endTouchZoom(e) {
      if (!touchZooming) return;
      if (e && e.pointerType === 'mouse') return;
      touchZooming = false;
      resetZoom();
    }
    stage.addEventListener('pointerup', endTouchZoom);
    stage.addEventListener('pointercancel', endTouchZoom);
  }

  document.querySelectorAll('[data-hp-product-gallery]').forEach(initGallery);
})();
