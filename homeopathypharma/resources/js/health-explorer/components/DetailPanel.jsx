function ListCard({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="hx-card">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({ product }) {
  if (!product) return null;
  return (
    <article className="hx-product">
      <h4>{product.name}</h4>
      <p className="meta">
        {product.manufacturer} · Potency: {product.potency}
      </p>
      <p><strong>Ingredients:</strong> {product.ingredients}</p>
      <p style={{ marginTop: '0.45rem' }}>{product.description}</p>
      <div className="hx-grid-2" style={{ marginTop: '0.75rem' }}>
        <div className="hx-card">
          <h4>Traditional homeopathic claims</h4>
          <p>{product.traditional_claims}</p>
        </div>
        <div className="hx-card">
          <h4>Scientific evidence status</h4>
          <p>{product.evidence_status}</p>
        </div>
        <div className="hx-card">
          <h4>Safety warnings</h4>
          <p>{product.safety_warnings}</p>
        </div>
        <div className="hx-card">
          <h4>Contraindications / interactions</h4>
          <p>{product.contraindications}</p>
        </div>
      </div>
    </article>
  );
}

export default function DetailPanel({
  mode,
  organ,
  disease,
  mental,
  systemName,
  diseases = [],
  products = [],
  relatedOrgans = [],
  shopUrl,
  consultUrl,
  onSelectOrgan,
  onSelectDisease,
  onSelectMental,
  onClear,
}) {
  if (mode === 'mental-list') {
    return (
      <div className="hx-panel__body">
        <div className="hx-breadcrumbs">
          <button type="button" onClick={onClear}>Explorer</button>
          <span>/</span>
          <span>Mental health</span>
        </div>
        <div className="hx-title-row">
          <h3>Mental Health</h3>
          <span className="hx-badge">Support-first</span>
        </div>
        <p className="hx-lead">
          Explore common mental health topics. This is educational guidance — not a diagnosis.
          If you are in crisis, contact local emergency services or a crisis helpline immediately.
        </p>
        <div className="hx-mental-grid">
          {mental.map((item) => (
            <button key={item.id} type="button" className="hx-mental-card" onClick={() => onSelectMental(item.id)}>
              <strong>{item.name}</strong>
              <span>{item.summary}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'mental' && mental) {
    const mentalProducts = products.filter((p) => mental.homeopathy_product_ids?.includes(p.id));
    return (
      <div className="hx-panel__body">
        <div className="hx-breadcrumbs">
          <button type="button" onClick={onClear}>Explorer</button>
          <span>/</span>
          <button type="button" onClick={() => onSelectMental(null)}>Mental health</button>
          <span>/</span>
          <span>{mental.name}</span>
        </div>
        <div className="hx-title-row">
          <h3>{mental.name}</h3>
          <span className="hx-badge">Mental health</span>
        </div>
        <p className="hx-lead">{mental.summary}</p>
        <div className="hx-grid-2">
          <ListCard title="Symptoms" items={mental.symptoms} />
          <ListCard title="Possible contributors" items={mental.causes} />
          <ListCard title="Professional treatment" items={mental.treatments} />
          <ListCard title="Support resources" items={mental.support} />
        </div>
        <h4 style={{ margin: '1.1rem 0 0.55rem', color: '#0a4f44' }}>Homeopathy information (traditional / labelled use)</h4>
        {mentalProducts.length ? mentalProducts.map((p) => <ProductCard key={p.id} product={p} />) : (
          <p className="hx-lead">No linked homeopathy products in the catalogue yet.</p>
        )}
        <div className="hx-actions">
          <a className="hx-btn hx-btn--primary" href={consultUrl}>Talk to a doctor</a>
          <a className="hx-btn hx-btn--ghost" href={shopUrl}>Browse shop</a>
        </div>
      </div>
    );
  }

  if (mode === 'disease' && disease) {
    const diseaseProducts = products.filter((p) => disease.homeopathy_product_ids?.includes(p.id));
    return (
      <div className="hx-panel__body">
        <div className="hx-breadcrumbs">
          <button type="button" onClick={onClear}>Explorer</button>
          <span>/</span>
          {organ ? (
            <>
              <button type="button" onClick={() => onSelectOrgan(organ.id)}>{organ.name}</button>
              <span>/</span>
            </>
          ) : null}
          <span>{disease.name}</span>
        </div>
        <div className="hx-title-row">
          <h3>{disease.name}</h3>
          <span className="hx-badge">Condition</span>
        </div>
        <p className="hx-lead">{disease.summary}</p>
        <div className="hx-grid-2">
          <ListCard title="Symptoms" items={disease.symptoms} />
          <ListCard title="Possible causes" items={disease.causes} />
          <ListCard title="Evidence-based care pathways" items={disease.treatments} />
          <ListCard title="Specialists" items={disease.specialists} />
        </div>
        {disease.organ_ids?.length ? (
          <div className="hx-related">
            {disease.organ_ids.map((id) => (
              <button key={id} type="button" onClick={() => onSelectOrgan(id)}>Related organ</button>
            ))}
          </div>
        ) : null}
        <h4 style={{ margin: '1.1rem 0 0.55rem', color: '#0a4f44' }}>Homeopathy information</h4>
        {diseaseProducts.length ? diseaseProducts.map((p) => <ProductCard key={p.id} product={p} />) : (
          <p className="hx-lead">No linked products yet.</p>
        )}
        <div className="hx-actions">
          <a className="hx-btn hx-btn--primary" href={consultUrl}>Consult a doctor</a>
          <a className="hx-btn hx-btn--ghost" href={shopUrl}>Shop remedies</a>
        </div>
      </div>
    );
  }

  if (mode === 'organ' && organ) {
    const organProducts = products.filter((p) => organ.homeopathy_product_ids?.includes(p.id));
    return (
      <div className="hx-panel__body">
        <div className="hx-breadcrumbs">
          <button type="button" onClick={onClear}>Explorer</button>
          <span>/</span>
          <span>{systemName || 'Body'}</span>
          <span>/</span>
          <span>{organ.name}</span>
        </div>
        <div className="hx-title-row">
          <h3>{organ.name}</h3>
          <span className="hx-badge">{systemName || organ.system_id}</span>
        </div>
        <p className="hx-lead">{organ.summary}</p>
        <div className="hx-grid-2">
          <div className="hx-card">
            <h4>Function</h4>
            <p>{organ.function}</p>
          </div>
          <div className="hx-card">
            <h4>Description</h4>
            <p>{organ.description}</p>
          </div>
          <ListCard title="Common symptoms to discuss" items={organ.symptoms} />
          <ListCard title="Possible causes" items={organ.causes} />
          <ListCard title="Risk factors" items={organ.risk_factors} />
          <ListCard title="Diagnostic tests" items={organ.diagnostics} />
          <ListCard title="Treatment options" items={organ.treatments} />
          <ListCard title="Specialists" items={organ.specialists} />
          <ListCard title="Prevention & lifestyle" items={organ.prevention} />
        </div>

        {diseases.length ? (
          <>
            <h4 style={{ margin: '1.1rem 0 0.55rem', color: '#0a4f44' }}>Related conditions</h4>
            <div className="hx-related">
              {diseases.map((d) => (
                <button key={d.id} type="button" onClick={() => onSelectDisease(d.id)}>{d.name}</button>
              ))}
            </div>
          </>
        ) : null}

        {relatedOrgans.length ? (
          <>
            <h4 style={{ margin: '1.1rem 0 0.55rem', color: '#0a4f44' }}>Related organs</h4>
            <div className="hx-related">
              {relatedOrgans.map((o) => (
                <button key={o.id} type="button" onClick={() => onSelectOrgan(o.id)}>{o.name}</button>
              ))}
            </div>
          </>
        ) : null}

        <h4 style={{ margin: '1.1rem 0 0.55rem', color: '#0a4f44' }}>Homeopathy information</h4>
        <p className="hx-lead" style={{ marginTop: 0 }}>
          Traditional / labelled product notes only — not prescriptions and not cure claims.
        </p>
        {organProducts.length ? organProducts.map((p) => <ProductCard key={p.id} product={p} />) : (
          <p className="hx-lead">No linked homeopathy products for this organ yet.</p>
        )}

        <div className="hx-actions">
          <a className="hx-btn hx-btn--primary" href={consultUrl}>Talk to a doctor</a>
          <a className="hx-btn hx-btn--ghost" href={shopUrl}>Browse shop</a>
        </div>
      </div>
    );
  }

  return (
    <div className="hx-panel__body">
      <div className="hx-empty">
        <strong>Select a hotspot to explore</strong>
        Click an organ on the body map, search a symptom, or open the Mental Health tab.
      </div>
    </div>
  );
}
