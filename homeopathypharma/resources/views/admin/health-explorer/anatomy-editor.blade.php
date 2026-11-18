@extends('layouts.admin')

@section('title', 'Anatomy editor')
@section('content')
@php
    $boot = [
        'organs' => $organs,
        'systems' => $systems,
        'diseases' => $diseases,
        'products' => $products,
        'saveUrl' => route('admin.health-explorer.anatomy.save'),
        'storeUrl' => route('admin.health-explorer.anatomy.store'),
        'destroyBase' => url('/admin/health-explorer/organs'),
        'csrf' => csrf_token(),
        'imageBase' => asset('images/health-explorer'),
    ];
@endphp

<div class="admin-top">
    <h2>Anatomy editor</h2>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Back to catalogue</a>
        <a class="btn btn-secondary" href="{{ route('health-explorer') }}" target="_blank" rel="noopener">Open live explorer</a>
    </div>
</div>

<p class="admin-card" style="margin-bottom:1rem;">
    Same male/female figures as the website. Pick a body and direction, drag red dots to align organs, then edit names and homeopathy details in the side panel.
</p>

<div id="ax-app" class="ax" data-boot='@json($boot)'>
    <div class="ax-toolbar">
        <div class="ax-seg" role="group" aria-label="Sex">
            <button type="button" data-gender="female" class="is-on">Female</button>
            <button type="button" data-gender="male">Male</button>
        </div>
        <div class="ax-seg" role="group" aria-label="View">
            <button type="button" data-view="front" class="is-on">Front</button>
            <button type="button" data-view="back">Back</button>
            <button type="button" data-view="left">Left</button>
            <button type="button" data-view="right">Right</button>
        </div>
        <button type="button" class="btn btn-primary" id="ax-add">Add organ here</button>
        <span class="ax-status" id="ax-status" aria-live="polite"></span>
    </div>

    <div class="ax-layout">
        <section class="ax-stage" aria-label="Anatomy canvas">
            <div class="ax-stage__top">
                <h3 id="ax-title">Female · front view</h3>
                <p class="ax-hint">Drag a red dot to move it. Click a dot to edit details.</p>
            </div>
            <div class="ax-figure" id="ax-figure">
                <img id="ax-image" src="" alt="Anatomy figure" width="420" height="900" draggable="false">
                <div class="ax-dots" id="ax-dots"></div>
            </div>
        </section>

        <aside class="ax-panel admin-card" id="ax-panel">
            <h3 style="margin-top:0;">Organ details</h3>
            <p id="ax-empty" class="ax-muted">Select a red dot (or add an organ) to edit its name, position, and homeopathy information.</p>
            <form id="ax-form" class="admin-form" hidden>
                <input type="hidden" name="id" id="ax-id">
                <label>Name <input name="name" id="ax-name" required></label>
                <label>System
                    <select name="system_id" id="ax-system" required>
                        @foreach ($systems as $system)
                            <option value="{{ $system['id'] }}">{{ $system['name'] }}</option>
                        @endforeach
                    </select>
                </label>
                <label>Shows on
                    <select name="gender" id="ax-gender">
                        <option value="both">Both</option>
                        <option value="female">Female only</option>
                        <option value="male">Male only</option>
                    </select>
                </label>
                <div class="ax-coords">
                    <label>X% <input type="number" step="0.1" min="0" max="100" id="ax-cx"></label>
                    <label>Y% <input type="number" step="0.1" min="0" max="100" id="ax-cy"></label>
                </div>
                <label>Summary <textarea id="ax-summary" rows="2"></textarea></label>
                <label>Function <textarea id="ax-function" rows="2"></textarea></label>
                <label>Description <textarea id="ax-description" rows="4"></textarea></label>
                <label>Symptoms (one per line) <textarea id="ax-symptoms" rows="3"></textarea></label>
                <label>Causes (one per line) <textarea id="ax-causes" rows="3"></textarea></label>
                <label>Treatments (one per line) <textarea id="ax-treatments" rows="3"></textarea></label>
                <label>Prevention (one per line) <textarea id="ax-prevention" rows="3"></textarea></label>
                <label>Specialists (one per line) <textarea id="ax-specialists" rows="2"></textarea></label>
                <label>Diagnostics (one per line) <textarea id="ax-diagnostics" rows="2"></textarea></label>
                <label>Risk factors (one per line) <textarea id="ax-risk" rows="2"></textarea></label>
                <fieldset class="ax-checks">
                    <legend>Linked conditions</legend>
                    <div id="ax-diseases" class="ax-check-list"></div>
                </fieldset>
                <fieldset class="ax-checks">
                    <legend>Homeopathy products</legend>
                    <div id="ax-products" class="ax-check-list"></div>
                </fieldset>
                <div class="admin-actions" style="margin-top:0.75rem;">
                    <button class="btn btn-primary" type="submit">Save organ</button>
                    <button class="btn btn-secondary" type="button" id="ax-delete">Delete</button>
                </div>
            </form>
        </aside>
    </div>
</div>

<style>
.ax { --ax-teal:#0d6b5c; --ax-mint:#e7f5f1; --ax-ink:#15231f; --ax-muted:#5b6b65; }
.ax-toolbar { display:flex; flex-wrap:wrap; gap:0.55rem; align-items:center; margin-bottom:1rem; }
.ax-seg { display:inline-flex; background:#fff; border:1px solid #d5e3dd; border-radius:999px; padding:0.15rem; gap:0.15rem; }
.ax-seg button { border:0; background:transparent; padding:0.4rem 0.85rem; border-radius:999px; font-weight:700; color:var(--ax-ink); cursor:pointer; }
.ax-seg button.is-on { background:var(--ax-teal); color:#fff; }
.ax-status { color:var(--ax-teal); font-weight:600; font-size:0.9rem; }
.ax-layout { display:grid; grid-template-columns: minmax(280px, 420px) minmax(280px, 1fr); gap:1.25rem; align-items:start; }
.ax-stage { background:transparent; }
.ax-stage__top h3 { margin:0 0 0.25rem; color:var(--ax-teal); }
.ax-hint { margin:0 0 0.75rem; color:var(--ax-muted); font-size:0.88rem; }
.ax-figure {
  position:relative; width:min(100%, 22rem); aspect-ratio:420 / 900; margin:0 auto;
  touch-action:none; user-select:none;
}
.ax-figure img {
  position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:center bottom;
  pointer-events:none; filter: drop-shadow(0 10px 16px rgba(20,40,50,0.12));
}
.ax-dots { position:absolute; inset:0; }
.ax-dot {
  position:absolute; width:1.35rem; height:1.35rem; border:0; padding:0; margin:0;
  transform:translate(-50%,-50%); background:transparent; cursor:grab; z-index:2;
}
.ax-dot.is-active .ax-dot__core { background:#c4091c; transform:translate(-50%,-50%) scale(1.32); }
.ax-dot.is-dragging { cursor:grabbing; z-index:5; }
.ax-dot__core {
  position:absolute; left:50%; top:50%; width:0.72rem; height:0.72rem; border-radius:50%;
  background:#e11d2e; box-shadow:0 1px 2px rgba(20,30,40,0.28); transform:translate(-50%,-50%);
}
.ax-dot__label {
  position:absolute; left:50%; bottom:calc(100% + 0.3rem); transform:translateX(-50%);
  white-space:nowrap; background:rgba(15,35,30,0.92); color:#fff; font-size:0.68rem;
  font-weight:700; padding:0.25rem 0.4rem; border-radius:0.35rem; pointer-events:none;
}
.ax-panel { position:sticky; top:5.5rem; max-height:calc(100vh - 6.5rem); overflow:auto; }
.ax-muted { color:var(--ax-muted); }
.ax-coords { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
.ax-checks { border:1px solid #e3e8e1; border-radius:0.65rem; padding:0.65rem 0.75rem; margin:0.65rem 0 0; }
.ax-checks legend { padding:0 0.25rem; font-weight:700; font-size:0.85rem; }
.ax-check-list { display:grid; gap:0.35rem; max-height:9rem; overflow:auto; }
.ax-check-list label { display:flex; gap:0.45rem; align-items:flex-start; font-weight:500; }
@media (max-width: 900px) {
  .ax-layout { grid-template-columns:1fr; }
  .ax-panel { position:static; max-height:none; }
}
</style>

<script>
(() => {
  const root = document.getElementById('ax-app');
  const boot = JSON.parse(root.getAttribute('data-boot'));
  const state = {
    gender: 'female',
    view: 'front', // front|back|left|right (viewer-relative)
    organs: structuredClone(boot.organs || []),
    selectedId: null,
    dirty: false,
  };

  const els = {
    title: document.getElementById('ax-title'),
    image: document.getElementById('ax-image'),
    dots: document.getElementById('ax-dots'),
    figure: document.getElementById('ax-figure'),
    status: document.getElementById('ax-status'),
    form: document.getElementById('ax-form'),
    empty: document.getElementById('ax-empty'),
    diseases: document.getElementById('ax-diseases'),
    products: document.getElementById('ax-products'),
  };

  /** Map viewer view → stored hotspot key + image file + mirror flag. */
  function viewMeta(view) {
    if (view === 'front') return { key: 'front', file: 'front', mirror: false };
    if (view === 'back') return { key: 'back', file: 'back', mirror: false };
    if (view === 'left') return { key: 'side', file: 'side', mirror: false }; // viewer left
    return { key: 'side', file: 'side-left', mirror: true }; // viewer right
  }

  function setStatus(msg, ok = true) {
    els.status.textContent = msg || '';
    els.status.style.color = ok ? 'var(--ax-teal)' : '#a12622';
  }

  function lines(value) {
    return String(value || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }
  function joinLines(arr) {
    return (arr || []).join('\n');
  }

  function organById(id) {
    return state.organs.find((o) => o.id === id || o.slug === id);
  }

  function ensureHotspots(organ) {
    organ.hotspots = organ.hotspots || {};
    for (const g of ['female', 'male']) {
      organ.hotspots[g] = organ.hotspots[g] || {};
      for (const v of ['front', 'side', 'back']) {
        organ.hotspots[g][v] = organ.hotspots[g][v] || { cx: 50, cy: 40, r: 1.15 };
      }
    }
  }

  function visibleOrgans() {
    return state.organs.filter((o) => o.gender === 'both' || o.gender === state.gender);
  }

  function displaySpot(organ) {
    ensureHotspots(organ);
    const meta = viewMeta(state.view);
    const spot = organ.hotspots?.[state.gender]?.[meta.key];
    if (!spot) return null;
    return {
      cx: meta.mirror ? 100 - Number(spot.cx) : Number(spot.cx),
      cy: Number(spot.cy),
    };
  }

  function writeSpot(organ, displayCx, displayCy) {
    ensureHotspots(organ);
    const meta = viewMeta(state.view);
    const cx = meta.mirror ? 100 - displayCx : displayCx;
    organ.hotspots[state.gender][meta.key] = {
      cx: Math.round(Math.max(0, Math.min(100, cx)) * 10) / 10,
      cy: Math.round(Math.max(0, Math.min(100, displayCy)) * 10) / 10,
      r: organ.hotspots[state.gender][meta.key]?.r || 1.15,
    };
    // Keep "both" bodies in sync unless gender-specific organ.
    if (organ.gender === 'both') {
      const other = state.gender === 'female' ? 'male' : 'female';
      // Do not overwrite the other gender's tuned coords automatically.
    }
  }

  function renderChecks() {
    const organ = organById(state.selectedId);
    els.diseases.innerHTML = (boot.diseases || []).map((d) => {
      const id = d.id || d.slug;
      const checked = organ && (organ.diseases || []).includes(id) ? 'checked' : '';
      return `<label><input type="checkbox" data-disease="${id}" ${checked}> ${d.name}</label>`;
    }).join('') || '<span class="ax-muted">No diseases yet.</span>';

    els.products.innerHTML = (boot.products || []).map((p) => {
      const id = p.id || p.slug;
      const checked = organ && (organ.homeopathy_product_ids || []).includes(id) ? 'checked' : '';
      return `<label><input type="checkbox" data-product="${id}" ${checked}> ${p.name}</label>`;
    }).join('') || '<span class="ax-muted">No products yet.</span>';
  }

  function fillForm(organ) {
    if (!organ) {
      els.form.hidden = true;
      els.empty.hidden = false;
      return;
    }
    els.empty.hidden = true;
    els.form.hidden = false;
    ensureHotspots(organ);
    const spot = displaySpot(organ) || { cx: 50, cy: 40 };
    document.getElementById('ax-id').value = organ.id;
    document.getElementById('ax-name').value = organ.name || '';
    document.getElementById('ax-system').value = organ.system_id || (boot.systems[0]?.id || '');
    document.getElementById('ax-gender').value = organ.gender || 'both';
    document.getElementById('ax-cx').value = spot.cx.toFixed(1);
    document.getElementById('ax-cy').value = spot.cy.toFixed(1);
    document.getElementById('ax-summary').value = organ.summary || '';
    document.getElementById('ax-function').value = organ.function || '';
    document.getElementById('ax-description').value = organ.description || '';
    document.getElementById('ax-symptoms').value = joinLines(organ.symptoms);
    document.getElementById('ax-causes').value = joinLines(organ.causes);
    document.getElementById('ax-treatments').value = joinLines(organ.treatments);
    document.getElementById('ax-prevention').value = joinLines(organ.prevention);
    document.getElementById('ax-specialists').value = joinLines(organ.specialists);
    document.getElementById('ax-diagnostics').value = joinLines(organ.diagnostics);
    document.getElementById('ax-risk').value = joinLines(organ.risk_factors);
    renderChecks();
  }

  function render() {
    const meta = viewMeta(state.view);
    els.title.textContent = `${state.gender === 'female' ? 'Female' : 'Male'} · ${state.view} view`;
    els.image.src = `${boot.imageBase}/${state.gender}/${meta.file}.webp?v=${Date.now()}`;

    root.querySelectorAll('[data-gender]').forEach((b) => b.classList.toggle('is-on', b.dataset.gender === state.gender));
    root.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('is-on', b.dataset.view === state.view));

    els.dots.innerHTML = '';
    visibleOrgans().forEach((organ) => {
      const spot = displaySpot(organ);
      if (!spot || Number.isNaN(spot.cx) || Number.isNaN(spot.cy)) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ax-dot' + (state.selectedId === organ.id ? ' is-active' : '');
      btn.style.left = `${spot.cx}%`;
      btn.style.top = `${spot.cy}%`;
      btn.dataset.id = organ.id;
      btn.title = organ.name;
      btn.innerHTML = `<span class="ax-dot__core"></span>${state.selectedId === organ.id ? `<span class="ax-dot__label">${organ.name}</span>` : ''}`;
      btn.addEventListener('pointerdown', (ev) => startDrag(ev, organ.id));
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        state.selectedId = organ.id;
        fillForm(organ);
        render();
      });
      els.dots.appendChild(btn);
    });

    fillForm(organById(state.selectedId));
  }

  function startDrag(ev, id) {
    ev.preventDefault();
    ev.stopPropagation();
    const organ = organById(id);
    if (!organ) return;
    state.selectedId = id;
    const btn = ev.currentTarget;
    btn.classList.add('is-dragging', 'is-active');
    fillForm(organ);
    render(); // refresh label
    const active = els.dots.querySelector(`[data-id="${id}"]`);
    if (active) active.classList.add('is-dragging', 'is-active');

    const onMove = (e) => {
      const rect = els.figure.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width) * 100;
      const cy = ((e.clientY - rect.top) / rect.height) * 100;
      writeSpot(organ, cx, cy);
      const node = els.dots.querySelector(`[data-id="${id}"]`);
      if (node) {
        const disp = displaySpot(organ);
        node.style.left = `${disp.cx}%`;
        node.style.top = `${disp.cy}%`;
      }
      document.getElementById('ax-cx').value = displaySpot(organ).cx.toFixed(1);
      document.getElementById('ax-cy').value = displaySpot(organ).cy.toFixed(1);
      state.dirty = true;
      setStatus('Unsaved position — click Save organ');
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      render();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }

  async function api(url, method, body) {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': boot.csrf,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || `Save failed (${res.status})`);
    return data;
  }

  function readFormIntoOrgan(organ) {
    organ.name = document.getElementById('ax-name').value.trim();
    organ.system_id = document.getElementById('ax-system').value;
    organ.gender = document.getElementById('ax-gender').value;
    organ.summary = document.getElementById('ax-summary').value.trim();
    organ.function = document.getElementById('ax-function').value.trim();
    organ.description = document.getElementById('ax-description').value.trim();
    organ.symptoms = lines(document.getElementById('ax-symptoms').value);
    organ.causes = lines(document.getElementById('ax-causes').value);
    organ.treatments = lines(document.getElementById('ax-treatments').value);
    organ.prevention = lines(document.getElementById('ax-prevention').value);
    organ.specialists = lines(document.getElementById('ax-specialists').value);
    organ.diagnostics = lines(document.getElementById('ax-diagnostics').value);
    organ.risk_factors = lines(document.getElementById('ax-risk').value);
    organ.diseases = [...els.diseases.querySelectorAll('input[data-disease]:checked')].map((i) => i.dataset.disease);
    organ.homeopathy_product_ids = [...els.products.querySelectorAll('input[data-product]:checked')].map((i) => i.dataset.product);

    const cx = parseFloat(document.getElementById('ax-cx').value);
    const cy = parseFloat(document.getElementById('ax-cy').value);
    if (!Number.isNaN(cx) && !Number.isNaN(cy)) writeSpot(organ, cx, cy);
  }

  els.form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const organ = organById(state.selectedId);
    if (!organ) return;
    readFormIntoOrgan(organ);
    setStatus('Saving…');
    try {
      const payload = {
        id: organ.id,
        name: organ.name,
        system_id: organ.system_id,
        gender: organ.gender,
        summary: organ.summary,
        function: organ.function,
        description: organ.description,
        symptoms: organ.symptoms,
        causes: organ.causes,
        risk_factors: organ.risk_factors,
        diagnostics: organ.diagnostics,
        treatments: organ.treatments,
        specialists: organ.specialists,
        prevention: organ.prevention,
        diseases: organ.diseases,
        homeopathy_product_ids: organ.homeopathy_product_ids,
        related_organ_ids: organ.related_organ_ids || [],
        hotspots: organ.hotspots,
      };
      const data = await api(boot.saveUrl, 'PUT', payload);
      const idx = state.organs.findIndex((o) => o.id === organ.id);
      if (idx >= 0) state.organs[idx] = data.organ;
      state.dirty = false;
      setStatus('Saved — live explorer will use these positions.');
      render();
    } catch (err) {
      setStatus(err.message || 'Save failed', false);
    }
  });

  document.getElementById('ax-add').addEventListener('click', async () => {
    const name = prompt('New organ name');
    if (!name || !name.trim()) return;
    const systemId = boot.systems[0]?.id;
    if (!systemId) {
      setStatus('Add a body system first.', false);
      return;
    }
    const meta = viewMeta(state.view);
    setStatus('Creating…');
    try {
      const data = await api(boot.storeUrl, 'POST', {
        name: name.trim(),
        system_id: systemId,
        gender: 'both',
        cx: 50,
        cy: 40,
        view: meta.key,
        body_gender: state.gender,
      });
      state.organs.push(data.organ);
      state.selectedId = data.organ.id;
      setStatus('Organ created — drag the dot into place, then Save.');
      render();
    } catch (err) {
      setStatus(err.message || 'Could not create organ', false);
    }
  });

  document.getElementById('ax-delete').addEventListener('click', async () => {
    const organ = organById(state.selectedId);
    if (!organ) return;
    if (!confirm(`Delete “${organ.name}”?`)) return;
    setStatus('Deleting…');
    try {
      const res = await fetch(`${boot.destroyBase}/${encodeURIComponent(organ.slug || organ.id)}`, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': boot.csrf,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({ _method: 'DELETE', _token: boot.csrf }),
      });
      if (!res.ok && res.status !== 302) {
        // Form delete redirects; treat opaque redirect / 200 as ok via follow
      }
      state.organs = state.organs.filter((o) => o.id !== organ.id);
      state.selectedId = null;
      setStatus('Deleted.');
      render();
      // Fallback hard delete via form navigation if fetch blocked
      if (!res.ok) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `${boot.destroyBase}/${encodeURIComponent(organ.slug || organ.id)}`;
        form.innerHTML = `<input type="hidden" name="_token" value="${boot.csrf}"><input type="hidden" name="_method" value="DELETE">`;
        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      setStatus(err.message || 'Delete failed', false);
    }
  });

  root.querySelectorAll('[data-gender]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.gender = btn.dataset.gender;
      render();
    });
  });
  root.querySelectorAll('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      render();
    });
  });

  ['ax-cx', 'ax-cy'].forEach((id) => {
    document.getElementById(id).addEventListener('change', () => {
      const organ = organById(state.selectedId);
      if (!organ) return;
      const cx = parseFloat(document.getElementById('ax-cx').value);
      const cy = parseFloat(document.getElementById('ax-cy').value);
      if (Number.isNaN(cx) || Number.isNaN(cy)) return;
      writeSpot(organ, cx, cy);
      state.dirty = true;
      setStatus('Unsaved position — click Save organ');
      render();
    });
  });

  render();
})();
</script>
@endsection
