# CCRH knowledge source — Homoeopathy, Science of Gentle Healing

Connected as the agent reference book for medicine / research questions about Homoeopathy.

| Field | Value |
|-------|--------|
| Title | Homoeopathy — Science of Gentle Healing |
| Publisher | Ministry of AYUSH / CCRH, Government of India |
| Edition | 2016 (ISBN 978-93-81458-07-5) |
| Official PDF | https://ccrhindia.ayush.gov.in/sites/default/files/2023-08/homoeopathy_gentle_healing_CCRH.pdf |

## Files

- `homoeopathy_gentle_healing_CCRH.txt` — full text extract (searchable)
- `chapters/` — chapter splits (1–6)
- `medicines.json` / `medicines.md` — CCRH monograph + Table 21/23 drug lists
- `index.json` — book metadata + chapter map
- `search.py` — CLI search helper
- `homoeopathy_gentle_healing_CCRH.pdf` — local PDF (optional; download if missing)

## Search

```bash
cd homeopathypharma
python3 knowledge/ccrh/search.py "Cassia sophera"
python3 knowledge/ccrh/search.py "drug proving"
```

## Agent rules

1. When the user asks to list medicines / drugs / CCRH research remedies, **search this dossier first** (`search.py` or `medicines.md`).
2. Cite the book (title + AYUSH/CCRH 2016) when answering from it.
3. This dossier is **research/regulatory**, not a full Materia Medica or store inventory. Do not invent potencies, doses, or retail SKUs that are not in the book or the site catalog.
4. Clinical advice stays educational; serious symptoms → doctor consult (existing site CTAs).

## Refresh PDF

```bash
curl -fsSL -L \
  'https://ccrhindia.ayush.gov.in/sites/default/files/2023-08/homoeopathy_gentle_healing_CCRH.pdf' \
  -o knowledge/ccrh/homoeopathy_gentle_healing_CCRH.pdf
pdftotext -layout knowledge/ccrh/homoeopathy_gentle_healing_CCRH.pdf \
  knowledge/ccrh/homoeopathy_gentle_healing_CCRH.txt
```
