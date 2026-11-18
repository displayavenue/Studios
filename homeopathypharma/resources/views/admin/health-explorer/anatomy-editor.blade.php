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
        'bulkUrl' => route('admin.health-explorer.anatomy.bulk'),
        'storeUrl' => route('admin.health-explorer.anatomy.store'),
        'autofillUrl' => route('admin.health-explorer.anatomy.autofill'),
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
    Same male/female figures as the website. Front, Back, Left, and Right each have their own red dots — removing or moving a dot on one view does not change the others.
    Use <strong>Save all changes</strong> before leaving. To add a marker on the current view only: <strong>Add red dot</strong>, click the body, enter the organ name.
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
        <button type="button" class="btn btn-primary" id="ax-add">Add red dot</button>
        <button type="button" class="btn btn-secondary" id="ax-add-cancel" hidden>Cancel placing</button>
        <button type="button" class="btn btn-primary" id="ax-save-all" disabled title="Save all moved dots and edits">Save all changes</button>
        <span class="ax-status" id="ax-status" aria-live="polite"></span>
    </div>

    <div class="ax-layout">
        <section class="ax-stage" aria-label="Anatomy canvas">
            <div class="ax-stage__top">
                <h3 id="ax-title">Female · front view</h3>
                <p class="ax-hint" id="ax-hint">Drag a red dot to move it. Click a dot to edit details. Use “Add red dot” then click the body to place a new one.</p>
            </div>
            <div class="ax-figure" id="ax-figure">
                <img id="ax-image" src="" alt="Anatomy figure" width="420" height="900" draggable="false">
                <div class="ax-dots" id="ax-dots"></div>
                <div class="ax-ghost" id="ax-ghost" hidden></div>
            </div>
        </section>

        <aside class="ax-panel admin-card" id="ax-panel">
            <div id="ax-create" class="ax-create" hidden>
                <h3 style="margin-top:0;">New red dot</h3>
                <p class="ax-muted">Only enter the name — system, summary, symptoms, treatments, and related homeopathy details are filled in automatically.</p>
                <form id="ax-create-form" class="admin-form">
                    <label>Name <input id="ax-new-name" required placeholder="e.g. Gallbladder" autocomplete="off"></label>
                    <p class="ax-muted" id="ax-new-pos">Position: —</p>
                    <div class="admin-actions">
                        <button class="btn btn-primary" type="submit">Create &amp; save</button>
                        <button class="btn btn-secondary" type="button" id="ax-create-cancel">Cancel</button>
                    </div>
                </form>
            </div>
            <h3 style="margin-top:0;" id="ax-details-title">Organ details</h3>
            <p id="ax-empty" class="ax-muted">Select a red dot, or click <strong>Add red dot</strong> and place one on the body.</p>
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
                    <button class="btn btn-primary" type="submit">Save this organ</button>
                    <button class="btn btn-secondary" type="button" id="ax-autofill" title="Fill empty fields from the organ name">Fill details from name</button>
                    <button class="btn btn-secondary" type="button" id="ax-remove-view" title="Remove this red dot from the current Front/Back/Left/Right view only">Remove from this view</button>
                    <button class="btn btn-secondary" type="button" id="ax-delete" title="Delete this organ from every view">Delete organ entirely</button>
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
.ax-figure.is-placing { cursor:crosshair; outline:2px dashed var(--ax-teal); outline-offset:4px; border-radius:0.5rem; }
.ax-ghost {
  position:absolute; width:0.85rem; height:0.85rem; border-radius:50%; background:#e11d2e;
  transform:translate(-50%,-50%); pointer-events:none; box-shadow:0 0 0 3px rgba(225,29,46,0.25); z-index:4;
}
.ax-create { margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid #e3e8e1; }
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
    dirtyIds: new Set(),
    placing: false,
    pending: null, // { cx, cy } display coords waiting for create form
    saving: false,
    _autofilling: false,
    autofillAttempted: new Set(),
  };

  const els = {
    title: document.getElementById('ax-title'),
    hint: document.getElementById('ax-hint'),
    image: document.getElementById('ax-image'),
    dots: document.getElementById('ax-dots'),
    figure: document.getElementById('ax-figure'),
    ghost: document.getElementById('ax-ghost'),
    status: document.getElementById('ax-status'),
    form: document.getElementById('ax-form'),
    empty: document.getElementById('ax-empty'),
    create: document.getElementById('ax-create'),
    detailsTitle: document.getElementById('ax-details-title'),
    diseases: document.getElementById('ax-diseases'),
    products: document.getElementById('ax-products'),
    addBtn: document.getElementById('ax-add'),
    addCancel: document.getElementById('ax-add-cancel'),
    saveAll: document.getElementById('ax-save-all'),
  };

  function markDirty(id) {
    if (id) state.dirtyIds.add(id);
    els.saveAll.disabled = state.dirtyIds.size === 0 || state.saving;
    els.saveAll.textContent = state.dirtyIds.size
      ? `Save all changes (${state.dirtyIds.size})`
      : 'Save all changes';
  }

  function clearDirty(ids) {
    (ids || [...state.dirtyIds]).forEach((id) => state.dirtyIds.delete(id));
    markDirty(null);
  }

  /** Map viewer view → stored hotspot key + image file. Each of the 4 views is independent. */
  function viewMeta(view) {
    if (view === 'front') return { key: 'front', file: 'front' };
    if (view === 'back') return { key: 'back', file: 'back' };
    if (view === 'left') return { key: 'left', file: 'side' };
    return { key: 'right', file: 'side-left' };
  }

  function migrateOrganHotspots(organ) {
    if (!organ) return;
    organ.hotspots = organ.hotspots || {};
    for (const g of ['female', 'male']) {
      const map = organ.hotspots[g] || {};
      organ.hotspots[g] = map;
      if (map.side && !map.left) {
        map.left = { cx: Number(map.side.cx), cy: Number(map.side.cy), r: Number(map.side.r || 1.15) };
      }
      if (map.side && !map.right) {
        map.right = {
          cx: Math.round((100 - Number(map.side.cx)) * 10) / 10,
          cy: Number(map.side.cy),
          r: Number(map.side.r || 1.15),
        };
      }
    }
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
    migrateOrganHotspots(organ);
    organ.hotspots = organ.hotspots || {};
    organ.hotspots.female = organ.hotspots.female || {};
    organ.hotspots.male = organ.hotspots.male || {};
  }

  function hasSpotOnCurrentView(organ) {
    ensureHotspots(organ);
    const meta = viewMeta(state.view);
    const spot = organ.hotspots?.[state.gender]?.[meta.key];
    return !!(spot && typeof spot.cx === 'number' && typeof spot.cy === 'number');
  }

  function visibleOrgans() {
    return state.organs.filter((o) => {
      if (!(o.gender === 'both' || o.gender === state.gender)) return false;
      return hasSpotOnCurrentView(o);
    });
  }

  function displaySpot(organ) {
    ensureHotspots(organ);
    const meta = viewMeta(state.view);
    const spot = organ.hotspots?.[state.gender]?.[meta.key];
    if (!spot || typeof spot.cx !== 'number') return null;
    return {
      cx: Number(spot.cx),
      cy: Number(spot.cy),
    };
  }

  function writeSpot(organ, displayCx, displayCy) {
    ensureHotspots(organ);
    const meta = viewMeta(state.view);
    organ.hotspots[state.gender][meta.key] = {
      cx: Math.round(Math.max(0, Math.min(100, displayCx)) * 10) / 10,
      cy: Math.round(Math.max(0, Math.min(100, displayCy)) * 10) / 10,
      r: organ.hotspots[state.gender][meta.key]?.r || 1.15,
    };
  }

  function removeSpotFromCurrentView(organ) {
    ensureHotspots(organ);
    const meta = viewMeta(state.view);
    if (organ.hotspots?.[state.gender]) {
      delete organ.hotspots[state.gender][meta.key];
      // Drop legacy shared side key so it cannot resurrect a removed left/right dot.
      if (meta.key === 'left' || meta.key === 'right') {
        delete organ.hotspots[state.gender].side;
      }
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

  function setPlacing(on) {
    state.placing = on;
    if (!on) {
      state.pending = null;
      els.ghost.hidden = true;
      els.create.hidden = true;
    }
    els.figure.classList.toggle('is-placing', on);
    els.addBtn.hidden = on;
    els.addCancel.hidden = !on;
    els.hint.textContent = on
      ? 'Click on the body to drop a new red dot, then name it in the side panel.'
      : 'Drag a red dot to move it. Click a dot to edit details. Use “Add red dot” then click the body to place a new one.';
    setStatus(on ? 'Place mode — click the anatomy figure' : '');
  }

  function organNeedsAutoFill(organ) {
    if (!organ) return false;
    const summary = (organ.summary || '').trim();
    const fn = (organ.function || '').trim();
    const symptoms = organ.symptoms || [];
    return !summary || !fn || !Array.isArray(symptoms) || symptoms.length === 0;
  }

  function fillForm(organ) {
    if (state.pending) {
      els.form.hidden = true;
      els.empty.hidden = true;
      els.create.hidden = false;
      els.detailsTitle.hidden = true;
      return;
    }
    els.create.hidden = true;
    els.detailsTitle.hidden = false;
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

    // Name-only organs created before autofill: fill details as soon as selected.
    if (
      organNeedsAutoFill(organ)
      && !state.placing
      && !state._autofilling
      && boot.autofillUrl
      && !state.autofillAttempted.has(organ.id)
    ) {
      state.autofillAttempted.add(organ.id);
      state._autofilling = true;
      autofillSelected({ force: false }).finally(() => { state._autofilling = false; });
    }
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
      markDirty(id);
      setStatus('Unsaved — click “Save all changes” or “Save this organ”');
    };
    const onUp = async () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      render();
      // Auto-save the moved organ so leaving the page keeps the new spot.
      try {
        await saveOrgan(organById(id), { quiet: true });
        setStatus(`Saved position for “${organById(id)?.name || id}”`);
      } catch (err) {
        setStatus(err.message || 'Auto-save failed — use Save all changes', false);
      }
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
    if (!els.form.hidden) {
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
  }

  async function saveOrgan(organ, { quiet = false } = {}) {
    if (!organ) return;
    if (!quiet && state.selectedId === organ.id) readFormIntoOrgan(organ);
    const payload = {
      id: organ.id,
      name: organ.name,
      system_id: organ.system_id,
      gender: organ.gender,
      summary: organ.summary,
      function: organ.function,
      description: organ.description,
      symptoms: organ.symptoms || [],
      causes: organ.causes || [],
      risk_factors: organ.risk_factors || [],
      diagnostics: organ.diagnostics || [],
      treatments: organ.treatments || [],
      specialists: organ.specialists || [],
      prevention: organ.prevention || [],
      diseases: organ.diseases || [],
      homeopathy_product_ids: organ.homeopathy_product_ids || [],
      related_organ_ids: organ.related_organ_ids || [],
      hotspots: organ.hotspots,
    };
    const data = await api(boot.saveUrl, 'PUT', payload);
    const idx = state.organs.findIndex((o) => o.id === organ.id);
    if (idx >= 0) state.organs[idx] = data.organ;
    clearDirty([organ.id]);
    return data.organ;
  }

  async function saveAllChanges() {
    if (state.saving) return;
    if (state.selectedId) {
      const selected = organById(state.selectedId);
      if (selected) {
        readFormIntoOrgan(selected);
        markDirty(selected.id);
      }
    }
    const ids = [...state.dirtyIds];
    if (!ids.length) {
      setStatus('Nothing to save');
      return;
    }
    state.saving = true;
    markDirty(null);
    setStatus(`Saving ${ids.length} change(s)…`);
    try {
      // Prefer bulk hotspot save, then full-save selected/dirty organs with details.
      const patches = ids.map((id) => {
        const o = organById(id);
        return o ? {
          id: o.id,
          name: o.name,
          system_id: o.system_id,
          gender: o.gender,
          hotspots: o.hotspots,
        } : null;
      }).filter(Boolean);
      await api(boot.bulkUrl, 'PUT', { organs: patches });
      for (const id of ids) {
        const o = organById(id);
        if (o) await saveOrgan(o, { quiet: true });
      }
      clearDirty(ids);
      setStatus(`Saved ${ids.length} anatomy change(s). Safe to leave this page.`);
      render();
    } catch (err) {
      ids.forEach((id) => state.dirtyIds.add(id));
      markDirty(null);
      setStatus(err.message || 'Save all failed', false);
    } finally {
      state.saving = false;
      markDirty(null);
    }
  }

  els.saveAll.addEventListener('click', () => saveAllChanges());

  window.addEventListener('beforeunload', (ev) => {
    if (state.dirtyIds.size === 0) return;
    ev.preventDefault();
    ev.returnValue = '';
  });

  els.form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const organ = organById(state.selectedId);
    if (!organ) return;
    setStatus('Saving…');
    try {
      await saveOrgan(organ);
      setStatus('Saved — live explorer will use these details.');
      render();
    } catch (err) {
      setStatus(err.message || 'Save failed', false);
    }
  });

  // Mark dirty when form fields change.
  els.form.addEventListener('input', () => {
    if (state.selectedId) markDirty(state.selectedId);
  });
  els.form.addEventListener('change', () => {
    if (state.selectedId) markDirty(state.selectedId);
  });

  function cancelPlace() {
    setPlacing(false);
    fillForm(organById(state.selectedId));
  }

  els.addBtn.addEventListener('click', () => {
    if (!boot.systems?.length) {
      setStatus('Add a body system first under Health Explorer catalogue.', false);
      return;
    }
    state.selectedId = null;
    setPlacing(true);
    fillForm(null);
  });
  els.addCancel.addEventListener('click', cancelPlace);
  document.getElementById('ax-create-cancel').addEventListener('click', cancelPlace);

  els.figure.addEventListener('pointermove', (ev) => {
    if (!state.placing || state.pending) return;
    const rect = els.figure.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 100;
    const y = ((ev.clientY - rect.top) / rect.height) * 100;
    if (x < 0 || x > 100 || y < 0 || y > 100) {
      els.ghost.hidden = true;
      return;
    }
    els.ghost.hidden = false;
    els.ghost.style.left = `${x}%`;
    els.ghost.style.top = `${y}%`;
  });

  els.figure.addEventListener('pointerleave', () => {
    if (state.placing && !state.pending) els.ghost.hidden = true;
  });

  els.figure.addEventListener('click', (ev) => {
    if (!state.placing || ev.target.closest('.ax-dot')) return;
    const rect = els.figure.getBoundingClientRect();
    const cx = Math.round(((ev.clientX - rect.left) / rect.width) * 1000) / 10;
    const cy = Math.round(((ev.clientY - rect.top) / rect.height) * 1000) / 10;
    if (cx < 0 || cx > 100 || cy < 0 || cy > 100) return;
    state.pending = { cx, cy };
    els.ghost.hidden = false;
    els.ghost.style.left = `${cx}%`;
    els.ghost.style.top = `${cy}%`;
    document.getElementById('ax-new-name').value = '';
    document.getElementById('ax-new-pos').textContent = `Position: ${cx.toFixed(1)}% × ${cy.toFixed(1)}% (${state.view} view)`;
    fillForm(null);
    document.getElementById('ax-new-name').focus();
    setStatus('Enter the organ name only — other details auto-fill on create');
  });

  document.getElementById('ax-create-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!state.pending) return;
    const name = document.getElementById('ax-new-name').value.trim();
    if (!name) return;
    const meta = viewMeta(state.view);
    setStatus(`Creating on ${state.view} view & auto-filling details…`);
    try {
      const data = await api(boot.storeUrl, 'POST', {
        name,
        cx: state.pending.cx,
        cy: state.pending.cy,
        view: meta.key,
        body_gender: state.gender,
      });
      migrateOrganHotspots(data.organ);
      const existingIdx = state.organs.findIndex((o) => o.id === data.organ.id);
      if (existingIdx >= 0) state.organs[existingIdx] = data.organ;
      else state.organs.push(data.organ);
      state.selectedId = data.organ.id;
      setPlacing(false);
      clearDirty([data.organ.id]);
      setStatus(
        data.updated_view
          ? `Updated “${data.organ.name}” on ${state.view} view only — other views unchanged.`
          : `Added “${data.organ.name}” on ${state.view} view only — other views unchanged.`
      );
      render();
    } catch (err) {
      setStatus(err.message || 'Could not create red dot', false);
    }
  });

  async function autofillSelected({ force = false } = {}) {
    const organ = organById(state.selectedId);
    if (!organ || !boot.autofillUrl) return;
    setStatus(`Filling details for “${organ.name}” from its name…`);
    try {
      const data = await api(boot.autofillUrl, 'POST', { id: organ.id, force: !!force });
      const idx = state.organs.findIndex((o) => o.id === organ.id);
      if (idx >= 0) state.organs[idx] = data.organ;
      clearDirty([organ.id]);
      setStatus(`Filled details for “${data.organ.name}” from its name.`);
      render();
    } catch (err) {
      setStatus(err.message || 'Could not autofill details', false);
    }
  }

  document.getElementById('ax-autofill').addEventListener('click', () => autofillSelected({ force: true }));

  document.getElementById('ax-remove-view').addEventListener('click', async () => {
    const organ = organById(state.selectedId);
    if (!organ) return;
    const meta = viewMeta(state.view);
    if (!hasSpotOnCurrentView(organ)) {
      setStatus(`No red dot for “${organ.name}” on this ${state.view} view.`, false);
      return;
    }
    if (!confirm(`Remove “${organ.name}” from the ${state.view} view only?\nOther views keep their dots.`)) return;
    setStatus(`Removing from ${state.view} view…`);
    try {
      removeSpotFromCurrentView(organ);
      await saveOrgan(organ, { quiet: true });
      state.selectedId = null;
      setStatus(`Removed “${organ.name}” from ${state.view} view only.`);
      render();
    } catch (err) {
      setStatus(err.message || 'Could not remove from this view', false);
    }
  });

  document.getElementById('ax-delete').addEventListener('click', async () => {
    const organ = organById(state.selectedId);
    if (!organ) return;
    if (!confirm(`Delete “${organ.name}” from EVERY view and the catalogue?`)) return;
    setStatus('Deleting organ entirely…');
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
      setStatus('Organ deleted from all views.');
      render();
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
      markDirty(organ.id);
      setStatus('Unsaved — click “Save all changes” or “Save this organ”');
      render();
    });
  });

  state.organs.forEach(migrateOrganHotspots);
  markDirty(null);
  render();
})();
</script>
@endsection
