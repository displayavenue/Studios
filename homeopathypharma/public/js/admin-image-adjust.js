(() => {
  const root = document.querySelector('[data-hp-imgadj]');
  if (!root || typeof Cropper === 'undefined') {
    return;
  }

  const imgEl = root.querySelector('[data-hp-imgadj-image]');
  const aspectEl = root.querySelector('[data-hp-imgadj-aspect]');
  const zoomEl = root.querySelector('[data-hp-imgadj-zoom]');
  const applyBtn = root.querySelector('[data-hp-imgadj-apply]');
  const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
  const adjustUrlTemplate = document.body.dataset.mediaAdjustUrl || '/admin/media/__ID__/adjust';
  const mediaShowTemplate = document.body.dataset.mediaShowUrl || '/admin/media/__ID__';

  let cropper = null;
  let active = null;

  function destroyCropper() {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  }

  function close() {
    destroyCropper();
    root.hidden = true;
    document.body.classList.remove('hp-imgadj-open');
    imgEl.removeAttribute('src');
    active = null;
  }

  function parseAspect(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : NaN;
  }

  function open(options) {
    active = {
      mediaId: options.mediaId || null,
      fileInput: options.fileInput || null,
      aspect: options.aspect ?? NaN,
      onApplied: typeof options.onApplied === 'function' ? options.onApplied : null,
      mime: options.mime || 'image/jpeg',
      filename: options.filename || 'adjusted.jpg',
    };

    if (Number.isFinite(active.aspect) && active.aspect > 0) {
      const match = [...aspectEl.options].find((opt) => Math.abs(Number(opt.value) - active.aspect) < 0.001);
      aspectEl.value = match ? match.value : 'NaN';
      if (!match) {
        aspectEl.value = String(active.aspect);
      }
    } else {
      aspectEl.value = 'NaN';
    }

    zoomEl.value = '1';
    destroyCropper();
    imgEl.onload = () => {
      cropper = new Cropper(imgEl, {
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        responsive: true,
        background: false,
        aspectRatio: parseAspect(aspectEl.value),
        ready() {
          const imageData = cropper.getImageData();
          if (imageData?.width) {
            zoomEl.value = String(imageData.width / (imageData.naturalWidth || imageData.width));
          }
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
    applyBtn.textContent = 'Saving…';

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
      applyBtn.textContent = 'Apply & save';
    }
  }

  root.querySelectorAll('[data-hp-imgadj-close]').forEach((el) => el.addEventListener('click', close));
  applyBtn.addEventListener('click', apply);
  aspectEl.addEventListener('change', () => {
    if (cropper) {
      cropper.setAspectRatio(parseAspect(aspectEl.value));
    }
  });
  zoomEl.addEventListener('input', () => {
    if (cropper) {
      cropper.zoomTo(Number(zoomEl.value) || 1);
    }
  });
  root.querySelectorAll('[data-hp-imgadj-rotate]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (cropper) {
        cropper.rotate(Number(btn.getAttribute('data-hp-imgadj-rotate')) || 0);
      }
    });
  });
  root.querySelector('[data-hp-imgadj-reset]')?.addEventListener('click', () => {
    if (cropper) {
      cropper.reset();
      zoomEl.value = '1';
    }
  });

  window.HpImageAdjust = { open, close };

  function bust(url) {
    if (!url) {
      return url;
    }
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}v=${Date.now()}`;
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

  function enhanceSelect(select) {
    if (select.dataset.hpImgEnhanced === '1') {
      return;
    }
    select.dataset.hpImgEnhanced = '1';
    const host = select.closest('label') || select.parentElement;
    if (!host) {
      return;
    }

    const aspect = Number(select.dataset.aspect || host.dataset.aspect || NaN);
    const wrap = ensurePreview(host, null);
    const actions = wrap.querySelector('.hp-img-preview__actions');

    async function refresh() {
      const id = select.value;
      if (!id) {
        ensurePreview(host, null);
        actions.innerHTML = '';
        return;
      }
      try {
        const media = await fetchMedia(id);
        const preview = ensurePreview(host, media.url);
        addAdjustButton(preview.querySelector('.hp-img-preview__actions'), () => {
          open({
            imageUrl: media.url,
            mediaId: media.id,
            aspect,
            mime: media.mime_type || 'image/jpeg',
            filename: media.original_name || `media-${media.id}.jpg`,
            onApplied: (updated) => {
              ensurePreview(host, updated.url);
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
          mime: file.type,
          filename: file.name,
          onApplied: (updated) => {
            if (updated?.url) {
              ensurePreview(host, updated.url);
            }
          },
        });
      }, 'Crop / zoom before upload');
      // Auto-open adjuster when a file is chosen
      open({
        imageUrl: url,
        fileInput: input,
        aspect,
        mime: file.type,
        filename: file.name,
        onApplied: (updated) => {
          if (updated?.url) {
            ensurePreview(host, updated.url);
          }
        },
      });
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
})();
