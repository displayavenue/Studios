import { useEffect, useMemo, useState, useTransition } from 'react';
import BodyFigure from './components/BodyFigure';
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
  const [view, setView] = useState('front');
  const [systemId, setSystemId] = useState('all');
  const [query, setQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [tab, setTab] = useState('anatomy');
  const [selectedOrganId, setSelectedOrganId] = useState(null);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(null);
  const [selectedMentalId, setSelectedMentalId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [, startTransition] = useTransition();

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

  const selectOrgan = (id) => {
    startTransition(() => {
      setSelectedOrganId(id);
      setSelectedDiseaseId(null);
      setSelectedMentalId(null);
      setTab('anatomy');
      const organ = organs.find((o) => o.id === id);
      if (organ?.hotspots?.[gender]?.back && !organ?.hotspots?.[gender]?.front && view === 'front') {
        setView('back');
      }
      if (organ?.hotspots?.[gender]?.front && !organ?.hotspots?.[gender]?.back && view === 'back') {
        setView('front');
      }
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
              <button type="button" aria-pressed={gender === 'female'} onClick={() => setGender('female')}>Female</button>
              <button type="button" aria-pressed={gender === 'male'} onClick={() => setGender('male')}>Male</button>
            </div>
            <div className="hx-seg" role="group" aria-label="View">
              <button type="button" aria-pressed={view === 'front'} onClick={() => setView('front')}>Front</button>
              <button type="button" aria-pressed={view === 'back'} onClick={() => setView('back')}>Back</button>
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
              onClick={() => setSystemId(system.id)}
              title={system.description}
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
              <div className="hx-zoom" role="group" aria-label="Zoom">
                <button type="button" className="hx-icon-btn" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.85, +(z - 0.1).toFixed(2)))}>−</button>
                <button type="button" className="hx-icon-btn" aria-label="Reset zoom" onClick={() => setZoom(1)}>⟲</button>
                <button type="button" className="hx-icon-btn" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1.45, +(z + 0.1).toFixed(2)))}>+</button>
              </div>
            </div>
            <BodyFigure
              gender={gender}
              view={view}
              organs={filteredOrgans}
              activeId={selectedOrganId}
              zoom={zoom}
              onSelect={selectOrgan}
            />
            <p style={{ margin: '0.65rem 0 0', color: '#5b6b65', fontSize: '0.84rem' }}>
              Tip: switch Front/Back if a hotspot is hidden on this view. Keyboard users can tab to hotspots and press Enter.
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
