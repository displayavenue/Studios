import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import BodyFigure, { frameKey, nearestFrame, normalizeYaw, viewLabel } from './components/BodyFigure';
import DetailPanel from './components/DetailPanel';

const TABS = [
  { id: 'anatomy', label: 'Anatomy' },
  { id: 'mental', label: 'Mental Health' },
  { id: 'search', label: 'Search results' },
];

export default function AnatomyExplorer({ catalogUrl, shopUrl, consultUrl }) {
  const [catalog, setCatalog] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [gender, setGender] = useState('female');
  const [yaw, setYaw] = useState(0);
  const [systemId, setSystemId] = useState('all');
  const [query, setQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [tab, setTab] = useState('anatomy');
  const [selectedOrganId, setSelectedOrganId] = useState(null);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(null);
  const [selectedMentalId, setSelectedMentalId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [, startTransition] = useTransition();
  const yawAnimRef = useRef(null);
  const view = viewLabel(yaw);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetch(catalogUrl, { headers: { Accept: 'application/json' } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Could not load explorer data (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setCatalog(data);
        setStatus('ready');
        const params = new URLSearchParams(window.location.search);
        const organParam = params.get('organ');
        const mentalParam = params.get('mental');
        if (mentalParam) {
          setTab('mental');
          setSelectedMentalId(mentalParam);
        } else if (organParam) {
          setSelectedOrganId(organParam);
          setTab('anatomy');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load');
        setStatus('error');
      });
    return () => { cancelled = true; };
  }, [catalogUrl]);

  const systems = catalog?.systems || [];
  const organs = catalog?.organs || [];
  const diseases = catalog?.diseases || [];
  const mentalConditions = catalog?.mental_conditions || [];
  const products = catalog?.homeopathy_products || [];
  const activeSystem = systems.find((s) => s.id === systemId) || null;
  // Overlay assets are keyed front/back/side/side-left (same as BodyFigure frames).
  const activeOverlayPath = activeSystem?.overlays?.[gender]?.[frameKey(yaw)] || null;

  const filteredOrgans = useMemo(() => {
    return organs.filter((organ) => {
      if (systemId !== 'all' && organ.system_id !== systemId) return false;
      if (organ.gender !== 'both' && organ.gender !== gender) return false;
      return true;
    });
  }, [organs, systemId, gender]);

  const searchHits = useMemo(() => {
    const q = committedQuery.trim().toLowerCase();
    if (!q) return { organs: [], diseases: [], mental: [] };
    const match = (text) => String(text || '').toLowerCase().includes(q);
    const inList = (arr = []) => arr.some((x) => match(x));
    return {
      organs: organs.filter((o) => match(o.name) || match(o.summary) || inList(o.symptoms)),
      diseases: diseases.filter((d) => match(d.name) || match(d.summary) || inList(d.symptoms)),
      mental: mentalConditions.filter((m) => match(m.name) || match(m.summary) || inList(m.symptoms)),
    };
  }, [committedQuery, organs, diseases, mentalConditions]);

  const selectedOrgan = organs.find((o) => o.id === selectedOrganId) || null;
  const selectedDisease = diseases.find((d) => d.id === selectedDiseaseId) || null;
  const selectedMental = mentalConditions.find((m) => m.id === selectedMentalId) || null;
  const systemName = systems.find((s) => s.id === selectedOrgan?.system_id)?.name;

  const organDiseases = useMemo(() => {
    if (!selectedOrgan) return [];
    return diseases.filter((d) => selectedOrgan.diseases?.includes(d.id) || d.organ_ids?.includes(selectedOrgan.id));
  }, [selectedOrgan, diseases]);

  const relatedOrgans = useMemo(() => {
    if (!selectedOrgan?.related_organ_ids?.length) return [];
    return organs.filter((o) => selectedOrgan.related_organ_ids.includes(o.id));
  }, [selectedOrgan, organs]);

  const panelMode = (() => {
    if (tab === 'mental') return selectedMental ? 'mental' : 'mental-list';
    if (selectedDisease) return 'disease';
    if (selectedOrgan) return 'organ';
    if (tab === 'search' && committedQuery) return 'search';
    return 'empty';
  })();

  const turnBy = (delta) => {
    if (yawAnimRef.current) cancelAnimationFrame(yawAnimRef.current);
    yawAnimRef.current = null;
    setYaw((prev) => nearestFrame(normalizeYaw(nearestFrame(prev) + delta)));
  };

  /** Jump straight to a named cardinal view (front / right / back / left). */
  const setCardinalView = (targetYaw) => {
    if (yawAnimRef.current) cancelAnimationFrame(yawAnimRef.current);
    yawAnimRef.current = null;
    setYaw(nearestFrame(targetYaw));
  };

  const selectOrgan = (id) => {
    startTransition(() => {
      setSelectedOrganId(id);
      setSelectedDiseaseId(null);
      setSelectedMentalId(null);
      setTab('anatomy');
      const organ = organs.find((o) => o.id === id);
      const spots = organ?.hotspots?.[gender];
      if (!spots) return;
      const current = nearestFrame(yaw);
      const has = (key) => spots[key] && typeof spots[key].cx === 'number';
      if (current === 0 && !has('front') && has('back')) setYaw(180);
      if (current === 180 && !has('back') && has('front')) setYaw(0);
      if (current === 90 && !has('left') && !has('side') && has('front')) setYaw(0);
      if (current === 270 && !has('right') && !has('side') && has('front')) setYaw(0);
    });
  };

  const selectDisease = (id) => {
    startTransition(() => {
      setSelectedDiseaseId(id);
      setSelectedMentalId(null);
      setTab('anatomy');
      const disease = diseases.find((d) => d.id === id);
      if (disease?.organ_ids?.[0]) setSelectedOrganId(disease.organ_ids[0]);
    });
  };

  const selectMental = (id) => {
    startTransition(() => {
      setTab('mental');
      setSelectedMentalId(id);
      setSelectedDiseaseId(null);
    });
  };

  const clearSelection = () => {
    setSelectedOrganId(null);
    setSelectedDiseaseId(null);
    setSelectedMentalId(null);
  };

  const runSearch = (event) => {
    event?.preventDefault?.();
    setCommittedQuery(query);
    setTab('search');
    clearSelection();
  };

  if (status === 'loading') {
    return (
      <div className="hx">
        <div className="hx-shell">
          <div className="hx-status" role="status">Loading Human Health Explorer…</div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="hx">
        <div className="hx-shell">
          <div className="hx-status error" role="alert">
            Could not load explorer data. {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hx">
      <div className="hx-shell">
        <header className="hx-hero">
          <p className="hx-kicker">Human Health Explorer</p>
          <h1>Explore the body. Understand conditions. Browse homeopathy information carefully.</h1>
          <p>
            Interactive male and female anatomy with organ hotspots, condition guides, mental health topics,
            and labelled homeopathy product notes — always separated from medical evidence.
          </p>
          <p className="hx-disclaimer" role="note">{catalog.disclaimer}</p>
        </header>

        <div className="hx-toolbar">
          <form className="hx-search" onSubmit={runSearch} role="search">
            <label className="hx-sr-only" htmlFor="hx-q">Search organs, symptoms, diseases</label>
            <input
              id="hx-q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organs, symptoms, diseases…"
              autoComplete="off"
            />
            <button type="submit">Search</button>
          </form>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
            <div className="hx-seg" role="group" aria-label="Sex">
              <button type="button" aria-pressed={gender === 'female'} onClick={() => { setGender('female'); setYaw(0); }}>Female</button>
              <button type="button" aria-pressed={gender === 'male'} onClick={() => { setGender('male'); setYaw(0); }}>Male</button>
            </div>
            <div className="hx-seg" role="group" aria-label="Anatomy view">
              <button type="button" aria-pressed={view === 'front'} onClick={() => setCardinalView(0)}>Front</button>
              <button type="button" aria-pressed={view === 'back'} onClick={() => setCardinalView(180)}>Back</button>
              {/* Viewer-relative: Left/Right match YOUR left/right, not the figure's. */}
              <button type="button" aria-pressed={view === 'left'} onClick={() => setCardinalView(90)}>Left</button>
              <button type="button" aria-pressed={view === 'right'} onClick={() => setCardinalView(270)}>Right</button>
            </div>
          </div>
        </div>

        <div className="hx-filters" role="toolbar" aria-label="Body systems">
          <button type="button" className="hx-chip" aria-pressed={systemId === 'all'} onClick={() => setSystemId('all')}>All systems</button>
          {systems.filter((s) => s.id !== 'mental').map((system) => (
            <button
              key={system.id}
              type="button"
              className="hx-chip"
              aria-pressed={systemId === system.id}
              onClick={() => {
                setSystemId(system.id);
                setTab('anatomy');
                // If this system only has a front overlay, snap to Front.
                const overlays = system.overlays || {};
                const hasFront = Boolean(overlays.female?.front || overlays.male?.front);
                const hasOther = ['back', 'side', 'side-left'].some(
                  (key) => overlays.female?.[key] || overlays.male?.[key],
                );
                if (hasFront && !hasOther) setYaw(0);
              }}
              title={system.description || system.summary || system.name}
            >
              {system.name}
            </button>
          ))}
          <button
            type="button"
            className="hx-chip"
            aria-pressed={tab === 'mental'}
            onClick={() => { setTab('mental'); setSelectedMentalId(null); }}
          >
            Mental Health
          </button>
        </div>

        <div className="hx-layout">
          <section className="hx-stage" aria-label="Anatomy stage">
            <div className="hx-stage__top">
              <h2>{gender === 'female' ? 'Female' : 'Male'} · {view} view</h2>
              <div className="hx-zoom" role="group" aria-label="Zoom and rotate">
                <button type="button" className="hx-icon-btn" aria-label="Turn left" onClick={() => turnBy(90)}>⟵</button>
                <button type="button" className="hx-icon-btn" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.85, +(z - 0.1).toFixed(2)))}>−</button>
                <button type="button" className="hx-icon-btn" aria-label="Reset view" onClick={() => { setZoom(1); setYaw(0); }}>⟲</button>
                <button type="button" className="hx-icon-btn" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1.45, +(z + 0.1).toFixed(2)))}>+</button>
                <button type="button" className="hx-icon-btn" aria-label="Turn right" onClick={() => turnBy(-90)}>⟶</button>
              </div>
            </div>
            <BodyFigure
              gender={gender}
              yaw={yaw}
              organs={filteredOrgans}
              activeId={selectedOrganId}
              zoom={zoom}
              systemId={systemId}
              systems={systems}
              onSelect={selectOrgan}
              onYawChange={setYaw}
            />
            <p style={{ margin: '0.65rem 0 0', color: '#5b6b65', fontSize: '0.84rem' }}>
              {activeOverlayPath
                ? `${activeSystem?.name || 'System'} overlay is shown for this view. Each system is edited separately in admin and keeps its own content.`
                : 'Drag sideways for a full 360° turn, or jump with Front / Back / Left / Right. Tap a red dot to open that organ.'}
            </p>
          </section>

          <section className="hx-panel" aria-live="polite">
            <div className="hx-tabs" role="tablist" aria-label="Explorer panels">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id || (item.id === 'anatomy' && tab !== 'mental' && tab !== 'search')}
                  onClick={() => {
                    setTab(item.id);
                    if (item.id === 'mental') setSelectedMentalId(null);
                    if (item.id === 'anatomy') setSelectedMentalId(null);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {tab === 'search' && committedQuery ? (
              <div className="hx-panel__body">
                <div className="hx-title-row">
                  <h3>Results for “{committedQuery}”</h3>
                </div>
                {!searchHits.organs.length && !searchHits.diseases.length && !searchHits.mental.length ? (
                  <div className="hx-empty"><strong>No matches</strong>Try another organ, symptom or condition name.</div>
                ) : (
                  <>
                    {searchHits.organs.length ? (
                      <>
                        <h4 style={{ color: '#0a4f44' }}>Organs</h4>
                        <div className="hx-related">
                          {searchHits.organs.map((o) => (
                            <button key={o.id} type="button" onClick={() => selectOrgan(o.id)}>{o.name}</button>
                          ))}
                        </div>
                      </>
                    ) : null}
                    {searchHits.diseases.length ? (
                      <>
                        <h4 style={{ color: '#0a4f44', marginTop: '1rem' }}>Conditions</h4>
                        <div className="hx-related">
                          {searchHits.diseases.map((d) => (
                            <button key={d.id} type="button" onClick={() => selectDisease(d.id)}>{d.name}</button>
                          ))}
                        </div>
                      </>
                    ) : null}
                    {searchHits.mental.length ? (
                      <>
                        <h4 style={{ color: '#0a4f44', marginTop: '1rem' }}>Mental health</h4>
                        <div className="hx-related">
                          {searchHits.mental.map((m) => (
                            <button key={m.id} type="button" onClick={() => selectMental(m.id)}>{m.name}</button>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </>
                )}
              </div>
            ) : (
              <DetailPanel
                mode={panelMode === 'search' ? 'empty' : panelMode}
                organ={selectedOrgan}
                disease={selectedDisease}
                mental={panelMode === 'mental-list' ? mentalConditions : selectedMental}
                systemName={systemName}
                diseases={organDiseases}
                products={products}
                relatedOrgans={relatedOrgans}
                shopUrl={shopUrl}
                consultUrl={consultUrl}
                onSelectOrgan={selectOrgan}
                onSelectDisease={selectDisease}
                onSelectMental={selectMental}
                onClear={clearSelection}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
