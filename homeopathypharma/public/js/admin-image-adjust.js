(() => {
  const root = document.querySelector('[data-hp-imgadj]');
  if (!root || typeof Cropper === 'undefined') {
    return;
  }

  const imgEl = root.querySelector('[data-hp-imgadj-image]');
  const aspectEl = root.querySelector('[data-hp-imgadj-aspect]');
  const zoomEl = root.querySelector('[data-hp-imgadj-zoom]');
  const applyBtn = root.querySelector('[data-hp-imgadj-apply]');
  const previewTypeEl = root.querySelector('[data-hp-imgadj-preview-type]');
  const previewFrame = root.querySelector('[data-hp-imgadj-preview-frame]');
  const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
  const adjustUrlTemplate = document.body.dataset.mediaAdjustUrl || '/admin/media/__ID__/adjust';
  const mediaShowTemplate = document.body.dataset.mediaShowUrl || '/admin/media/__ID__';

  let cropper = null;
  let active = null;
  let previewTimer = null;
  let previewObjectUrl = null;

  const ASPECT_PRESETS = {
    disease: 1376 / 1146,
    'disease-detail': 1376 / 1146,
    doctor: 1,
    product: 1,
    hero: 2000 / 751,
    gallery: 16 / 9,
  };

  function destroyCropper() {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  }

  function clearPreviewUrl() {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      previewObjectUrl = null;
    }
  }

  function close() {
    if (previewTimer) {
      clearTimeout(previewTimer);
      previewTimer = null;
    }
    destroyCropper();
    clearPreviewUrl();
    root.hidden = true;
    document.body.classList.remove('hp-imgadj-open');
    imgEl.removeAttribute('src');
    active = null;
  }

  function parseAspect(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : NaN;
  }

  function setPreviewType(type) {
    const next = ASPECT_PRESETS[type] ? type : 'disease';
    if (previewTypeEl) {
      previewTypeEl.value = next;
    }
    if (previewFrame) {
      previewFrame.dataset.preview = next;
    }
    root.querySelectorAll('[data-preview-panel]').forEach((panel) => {
      panel.hidden = panel.getAttribute('data-preview-panel') !== next;
    });
    return next;
  }

  function guessPreviewType(aspect, explicit) {
    if (explicit && ASPECT_PRESETS[explicit]) {
      return explicit;
    }
    if (!Number.isFinite(aspect) || aspect <= 0) {
      return 'gallery';
    }
    if (Math.abs(aspect - 1376 / 1146) < 0.02) {
      return 'disease';
    }
    if (Math.abs(aspect - 1) < 0.05) {
      return 'doctor';
    }
    if (Math.abs(aspect - 2000 / 751) < 0.05) {
      return 'hero';
    }
    if (aspect >= 1.6) {
      return 'gallery';
    }
    return 'disease';
  }

  function refreshFrontendPreview() {
    if (!cropper) {
      return;
    }
    try {
      const canvas = cropper.getCroppedCanvas({
        maxWidth: 720,
        maxHeight: 720,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      if (!canvas) {
        return;
      }
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }
        clearPreviewUrl();
        previewObjectUrl = URL.createObjectURL(blob);
        root.querySelectorAll('[data-hp-imgadj-preview-media]').forEach((el) => {
          const img = el.querySelector('[data-hp-imgadj-preview-img]');
          if (img) {
            img.src = previewObjectUrl;
            el.style.backgroundImage = '';
          } else {
            el.style.backgroundImage = `url('${previewObjectUrl}')`;
          }
        });
      }, 'image/jpeg', 0.88);
    } catch (e) {
      // Cropper may not be ready yet.
    }
  }

  function schedulePreview() {
    if (previewTimer) {
      clearTimeout(previewTimer);
    }
    previewTimer = setTimeout(refreshFrontendPreview, 80);
  }

  function isLockedAspect(aspect) {
    return Number.isFinite(aspect) && aspect > 0;
  }

  /**
   * Locked aspect (disease card etc.): keep a fixed crop frame matching the
   * website box. User pans/zooms the image — dragging one edge must NOT shrink
   * the other sides (that was Cropper's proportional resize).
   * Free aspect: allow independent edge resizing.
   */
  function applyCropMode(aspect) {
    if (!cropper) {
      return;
    }
    const locked = isLockedAspect(aspect);
    cropper.setAspectRatio(locked ? aspect : NaN);
    cropper.setDragMode('move');
    cropper.options.cropBoxResizable = !locked;
    cropper.options.cropBoxMovable = !locked;
    if (locked) {
      // Rebuild crop box to fill the stage at the locked ratio, then only pan/zoom.
      const container = cropper.getContainerData();
      if (container?.width && container?.height) {
        let boxW = container.width * 0.92;
        let boxH = boxW / aspect;
        if (boxH > container.height * 0.92) {
          boxH = container.height * 0.92;
          boxW = boxH * aspect;
        }
        cropper.setCropBoxData({
          left: (container.width - boxW) / 2,
          top: (container.height - boxH) / 2,
          width: boxW,
          height: boxH,
        });
      }
    }
    const hint = root.querySelector('[data-hp-imgadj-mode-hint]');
    if (hint) {
      hint.textContent = locked
        ? 'Website box size is fixed. Drag the image to reposition, use Zoom to scale — sides will not shrink together.'
        : 'Free crop: drag each edge independently.';
    }
  }

  function readFormText(name) {
    if (!name) {
      return '';
    }
    const el = document.querySelector(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`);
    return (el?.value || '').trim();
  }

  function applyPreviewCopy(title, subtitle) {
    const t = title || 'Disease title';
    const s = subtitle || 'Category';
    root.querySelectorAll('[data-hp-imgadj-preview-title]').forEach((el) => {
      el.textContent = t;
    });
    root.querySelectorAll('[data-hp-imgadj-preview-subtitle]').forEach((el) => {
      el.textContent = s;
    });
    document.querySelectorAll('[data-hp-site-card-title]').forEach((el) => {
      el.textContent = t;
    });
    document.querySelectorAll('[data-hp-site-card-subtitle]').forEach((el) => {
      el.textContent = s;
    });
  }

  function open(options) {
    const titleFromForm = readFormText(options.titleInput || 'title');
    const subtitleFromForm = readFormText(options.subtitleInput || 'category');
    active = {
      mediaId: options.mediaId || null,
      fileInput: options.fileInput || null,
      aspect: options.aspect ?? NaN,
      preview: options.preview || null,
      title: options.title || titleFromForm || '',
      subtitle: options.subtitle || subtitleFromForm || '',
      titleInput: options.titleInput || 'title',
      subtitleInput: options.subtitleInput || 'category',
      onApplied: typeof options.onApplied === 'function' ? options.onApplied : null,
      mime: options.mime || 'image/jpeg',
      filename: options.filename || 'adjusted.jpg',
    };

    const previewType = setPreviewType(guessPreviewType(active.aspect, active.preview));
    if (Number.isFinite(active.aspect) && active.aspect > 0) {
      const match = [...aspectEl.options].find((opt) => Math.abs(Number(opt.value) - active.aspect) < 0.001);
      aspectEl.value = match ? match.value : String(active.aspect);
    } else if (ASPECT_PRESETS[previewType]) {
      aspectEl.value = String(ASPECT_PRESETS[previewType]);
      active.aspect = ASPECT_PRESETS[previewType];
    } else {
      aspectEl.value = 'NaN';
    }

    applyPreviewCopy(active.title, active.subtitle);

    zoomEl.value = '1';
    destroyCropper();
    clearPreviewUrl();
    imgEl.onload = () => {
      const initialAspect = parseAspect(aspectEl.value);
      const locked = isLockedAspect(initialAspect);
      cropper = new Cropper(imgEl, {
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        responsive: true,
        background: false,
        aspectRatio: locked ? initialAspect : NaN,
        cropBoxResizable: !locked,
        cropBoxMovable: !locked,
        guides: true,
        center: true,
        highlight: true,
        ready() {
          applyCropMode(parseAspect(aspectEl.value));
          const imageData = cropper.getImageData();
          if (imageData?.width) {
            zoomEl.value = String(imageData.width / (imageData.naturalWidth || imageData.width));
          }
          refreshFrontendPreview();
        },
        crop() {
          schedulePreview();
        },
        zoom() {
          schedulePreview();
        },
      });
    };
    imgEl.src = options.imageUrl;
    root.hidden = false;
    document.body.classList.add('hp-imgadj-open');
  }

  async function apply() {
    if (!cropper || !active) {
      return;
    }

    applyBtn.disabled = true;
    applyBtn.textContent = 'Saving to website…';

    try {
      const canvas = cropper.getCroppedCanvas({
        maxWidth: 2400,
        maxHeight: 2400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      if (!canvas) {
        throw new Error('Could not crop image.');
      }

      const mime = active.mime.includes('png') ? 'image/png' : (active.mime.includes('webp') ? 'image/webp' : 'image/jpeg');
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, 0.92));
      if (!blob) {
        throw new Error('Could not encode image.');
      }

      const file = new File([blob], active.filename.replace(/\.\w+$/, mime === 'image/png' ? '.png' : mime === 'image/webp' ? '.webp' : '.jpg'), {
        type: mime,
      });

      if (active.mediaId) {
        const url = adjustUrlTemplate.replace('__ID__', String(active.mediaId));
        const body = new FormData();
        body.append('file', file);
        body.append('_token', csrf);
        const res = await fetch(url, {
          method: 'POST',
          headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body,
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.message || 'Adjust failed.');
        }
        if (active.onApplied) {
          active.onApplied(json.media);
        }
        close();
        return;
      }

      if (active.fileInput) {
        const dt = new DataTransfer();
        dt.items.add(file);
        active.fileInput.files = dt.files;
        active.fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        if (active.onApplied) {
          active.onApplied({ url: URL.createObjectURL(blob), local: true });
        }
        close();
        return;
      }

      throw new Error('Nothing to save.');
    } catch (err) {
      alert(err?.message || 'Could not save adjusted image.');
    } finally {
      applyBtn.disabled = false;
      applyBtn.textContent = 'Apply & save to website';
    }
  }

  root.querySelectorAll('[data-hp-imgadj-close]').forEach((el) => el.addEventListener('click', close));
  applyBtn.addEventListener('click', apply);
  aspectEl.addEventListener('change', () => {
    if (cropper) {
      applyCropMode(parseAspect(aspectEl.value));
      schedulePreview();
    }
  });
  zoomEl.addEventListener('input', () => {
    if (cropper) {
      cropper.zoomTo(Number(zoomEl.value) || 1);
      schedulePreview();
    }
  });
  previewTypeEl?.addEventListener('change', () => {
    const type = setPreviewType(previewTypeEl.value);
    if (ASPECT_PRESETS[type] && cropper) {
      aspectEl.value = String(ASPECT_PRESETS[type]);
      cropper.setAspectRatio(ASPECT_PRESETS[type]);
    }
    schedulePreview();
  });
  root.querySelectorAll('[data-hp-imgadj-rotate]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (cropper) {
        cropper.rotate(Number(btn.getAttribute('data-hp-imgadj-rotate')) || 0);
        schedulePreview();
      }
    });
  });
  root.querySelector('[data-hp-imgadj-reset]')?.addEventListener('click', () => {
    if (cropper) {
      cropper.reset();
      zoomEl.value = '1';
      schedulePreview();
    }
  });

  window.HpImageAdjust = { open, close };

  function bust(url) {
    if (!url) {
      return url;
    }
    // Strip old v= then append fresh bust so admin previews update immediately.
    const clean = String(url).replace(/([?&])v=\d+/g, '').replace(/[?&]$/, '');
    const sep = clean.includes('?') ? '&' : '?';
    return `${clean}${sep}v=${Date.now()}`;
  }

  function ensurePreview(host, url) {
    let wrap = host.querySelector('[data-hp-img-preview]');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'hp-img-preview';
      wrap.setAttribute('data-hp-img-preview', '');
      wrap.innerHTML = '<img alt=""><div class="hp-img-preview__actions"></div>';
      host.appendChild(wrap);
    }
    const image = wrap.querySelector('img');
    if (url) {
      image.src = bust(url);
      wrap.hidden = false;
    } else {
      image.removeAttribute('src');
      wrap.hidden = true;
    }
    return wrap;
  }

  function addAdjustButton(actions, handler, label = 'Adjust image') {
    let btn = actions.querySelector('[data-hp-img-adjust-btn]');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary';
      btn.setAttribute('data-hp-img-adjust-btn', '');
      actions.appendChild(btn);
    }
    btn.textContent = label;
    btn.onclick = handler;
    return btn;
  }

  async function fetchMedia(id) {
    const url = mediaShowTemplate.replace('__ID__', String(id));
    const res = await fetch(url, { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      throw new Error('Could not load media.');
    }
    return json.media;
  }

  function contextFromSelect(select) {
    const name = select.getAttribute('name') || '';
    const host = select.closest('label');
    const aspect = Number(select.dataset.aspect || host?.dataset.aspect || NaN);
    let preview = select.dataset.preview || host?.dataset.preview || null;
    if (!preview) {
      if (name.includes('photo_media') || name.includes('logo_media')) {
        preview = 'doctor';
      } else if (name.includes('cover_media')) {
        preview = 'gallery';
      } else if (name.includes('media_asset_id') && location.pathname.includes('/conditions')) {
        preview = 'disease';
      } else if (location.pathname.includes('/homepage')) {
        preview = name.includes('payload') ? 'hero' : 'gallery';
      } else if (location.pathname.includes('/products')) {
        preview = 'product';
      } else if (location.pathname.includes('/gallery')) {
        preview = 'gallery';
      } else if (location.pathname.includes('/doctors') || location.pathname.includes('/team')) {
        preview = 'doctor';
      }
    }
    return {
      aspect,
      preview,
      titleInput: select.dataset.previewTitleInput || host?.dataset.previewTitleInput || 'title',
      subtitleInput: select.dataset.previewSubtitleInput || host?.dataset.previewSubtitleInput || 'category',
    };
  }

  function updateSiteCardMedia(url) {
    const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    document.querySelectorAll('[data-hp-site-card-media]').forEach((el) => {
      const img = el.querySelector('[data-hp-site-card-img]');
      const next = url ? bust(url) : placeholder;
      if (img) {
        img.src = next;
        el.style.backgroundImage = '';
      } else if (url) {
        el.style.backgroundImage = `url('${bust(url)}')`;
      } else {
        el.style.backgroundImage = '';
      }
    });
  }

  function enhanceSelect(select) {
    if (select.dataset.hpImgEnhanced === '1') {
      return;
    }
    select.dataset.hpImgEnhanced = '1';
    const host = select.closest('label') || select.parentElement;
    if (!host) {
      return;
    }

    const ctx = contextFromSelect(select);
    const wrap = ensurePreview(host, null);
    const actions = wrap.querySelector('.hp-img-preview__actions');

    async function refresh() {
      const id = select.value;
      applyPreviewCopy(readFormText(ctx.titleInput), readFormText(ctx.subtitleInput));
      if (!id) {
        ensurePreview(host, null);
        updateSiteCardMedia('');
        actions.innerHTML = '';
        return;
      }
      try {
        const media = await fetchMedia(id);
        const preview = ensurePreview(host, media.url);
        updateSiteCardMedia(media.url);
        addAdjustButton(preview.querySelector('.hp-img-preview__actions'), () => {
          open({
            imageUrl: media.url,
            mediaId: media.id,
            aspect: ctx.aspect,
            preview: ctx.preview || 'disease',
            titleInput: ctx.titleInput,
            subtitleInput: ctx.subtitleInput,
            title: readFormText(ctx.titleInput),
            subtitle: readFormText(ctx.subtitleInput),
            mime: media.mime_type || 'image/jpeg',
            filename: media.original_name || `media-${media.id}.jpg`,
            onApplied: (updated) => {
              ensurePreview(host, updated.url);
              updateSiteCardMedia(updated.url);
            },
          });
        });
      } catch (e) {
        ensurePreview(host, null);
      }
    }

    select.addEventListener('change', refresh);
    refresh();
  }

  function enhanceSiteCards() {
    document.querySelectorAll('[data-hp-site-card]').forEach((card) => {
      if (card.dataset.hpImgEnhanced === '1') {
        return;
      }
      card.dataset.hpImgEnhanced = '1';
      const titleInput = 'title';
      const subtitleInput = 'category';
      const syncCopy = () => applyPreviewCopy(readFormText(titleInput), readFormText(subtitleInput));
      document.querySelector(`input[name="${titleInput}"]`)?.addEventListener('input', syncCopy);
      document.querySelector(`input[name="${subtitleInput}"]`)?.addEventListener('input', syncCopy);
      syncCopy();

      card.querySelector('[data-hp-site-card-adjust]')?.addEventListener('click', async () => {
        const select = document.querySelector('select[name="media_asset_id"]');
        const id = select?.value;
        if (!id) {
          alert('Select an image from Media Library first, then adjust it in this box.');
          return;
        }
        try {
          const media = await fetchMedia(id);
          open({
            imageUrl: media.url,
            mediaId: media.id,
            aspect: 1376 / 1146,
            preview: 'disease',
            titleInput,
            subtitleInput,
            title: readFormText(titleInput),
            subtitle: readFormText(subtitleInput),
            mime: media.mime_type || 'image/jpeg',
            filename: media.original_name || `media-${media.id}.jpg`,
            onApplied: (updated) => {
              updateSiteCardMedia(updated.url);
              const host = select.closest('label');
              if (host) {
                ensurePreview(host, updated.url);
              }
            },
          });
        } catch (e) {
          alert('Could not open image adjuster.');
        }
      });
    });
  }

  function enhanceFileInput(input) {
    if (input.dataset.hpImgEnhanced === '1') {
      return;
    }
    input.dataset.hpImgEnhanced = '1';
    const host = input.closest('label') || input.parentElement;
    if (!host) {
      return;
    }
    const aspect = Number(input.dataset.aspect || host.dataset.aspect || NaN);
    const preview = input.dataset.preview || host.dataset.preview || (location.pathname.includes('/homepage') ? 'hero' : null);
    const wrap = ensurePreview(host, null);
    const actions = wrap.querySelector('.hp-img-preview__actions');

    const openForFile = (file) => {
      if (!file || !file.type.startsWith('image/')) {
        return;
      }
      const url = URL.createObjectURL(file);
      ensurePreview(host, url);
      addAdjustButton(actions, () => {
        open({
          imageUrl: url,
          fileInput: input,
          aspect,
          preview,
          mime: file.type,
          filename: file.name,
          onApplied: (updated) => {
            if (updated?.url) {
              ensurePreview(host, updated.url);
            }
          },
        });
      }, 'Adjust image');
      // Do not auto-open — adjuster opens only when the user clicks Adjust.
    };

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (file) {
        openForFile(file);
      } else {
        ensurePreview(host, null);
        actions.innerHTML = '';
      }
    });
  }

  function enhanceMediaCards() {
    document.querySelectorAll('[data-hp-media-card]').forEach((card) => {
      if (card.dataset.hpImgEnhanced === '1') {
        return;
      }
      card.dataset.hpImgEnhanced = '1';
      const id = card.dataset.mediaId;
      const url = card.dataset.mediaUrl;
      const mime = card.dataset.mediaMime || 'image/jpeg';
      const name = card.dataset.mediaName || `media-${id}.jpg`;
      const actions = card.querySelector('[data-hp-media-card-actions]') || card;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary';
      btn.textContent = 'Adjust image';
      btn.addEventListener('click', () => {
        open({
          imageUrl: url,
          mediaId: Number(id),
          mime,
          filename: name,
          preview: 'disease',
          onApplied: (updated) => {
            const image = card.querySelector('img');
            if (image && updated?.url) {
              image.src = updated.url;
            }
            card.dataset.mediaUrl = updated.url;
          },
        });
      });
      actions.prepend(btn);
    });
  }

  function enhanceProductChecks() {
    document.querySelectorAll('input[type="checkbox"][name="media_ids[]"]').forEach((input) => {
      if (input.dataset.hpImgEnhanced === '1') {
        return;
      }
      input.dataset.hpImgEnhanced = '1';
      const label = input.closest('label');
      if (!label) {
        return;
      }
      const id = input.value;
      const host = document.createElement('div');
      host.className = 'hp-img-preview-inline';
      label.appendChild(host);

      fetchMedia(id).then((media) => {
        const img = document.createElement('img');
        img.src = media.url;
        img.alt = '';
        img.className = 'hp-img-thumb';
        host.appendChild(img);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-secondary';
        btn.textContent = 'Adjust';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          open({
            imageUrl: media.url,
            mediaId: media.id,
            mime: media.mime_type || 'image/jpeg',
            filename: media.original_name || `media-${media.id}.jpg`,
            preview: 'product',
            aspect: 1,
            onApplied: (updated) => {
              img.src = updated.url;
              media.url = updated.url;
            },
          });
        });
        host.appendChild(btn);
      }).catch(() => {});
    });
  }

  const mediaSelectNames = [
    'media_asset_id',
    'photo_media_id',
    'logo_media_id',
    'image_media_id',
    'cover_media_id',
  ];

  document.querySelectorAll('select').forEach((select) => {
    const name = select.getAttribute('name') || '';
    if (mediaSelectNames.some((n) => name === n || name.endsWith(`[${n}]`) || name.includes('media_asset_id'))) {
      enhanceSelect(select);
    }
  });

  document.querySelectorAll('input[type="file"][accept*="image"]').forEach(enhanceFileInput);
  enhanceMediaCards();
  enhanceProductChecks();
  enhanceSiteCards();
})();
