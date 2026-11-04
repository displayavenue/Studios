import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AnatomyExplorer from './AnatomyExplorer';
import './AnatomyExplorer.css';

const el = document.getElementById('health-explorer-root');
if (el) {
  const catalogUrl = el.dataset.catalogUrl || '/data/health-explorer/catalog.json';
  const shopUrl = el.dataset.shopUrl || '/shop';
  const consultUrl = el.dataset.consultUrl || '/consult';
  createRoot(el).render(
    <StrictMode>
      <AnatomyExplorer catalogUrl={catalogUrl} shopUrl={shopUrl} consultUrl={consultUrl} />
    </StrictMode>,
  );
}
