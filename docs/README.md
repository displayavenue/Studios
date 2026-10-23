# KliqPrint brand documents

Word documents for the **KliqPrint** client brand (not DisplayAvenue).

## Files

| File | Format |
|------|--------|
| `KliqPrint_Brand_Documents.doc` | Word-compatible RTF `.doc` |
| `KliqPrint_Brand_Documents.docx` | Microsoft Word `.docx` |

Both include:

1. About Us  
2. Contact Us  
3. Privacy Policy  
4. Terms of Use  
5. Frequently Asked Questions (FAQs)  
6. Return & Refund Policy  
7. Sitemap  

## Placeholders to fill

- `[Your Contact Number]`
- `[Your Email Address]`
- `[Your Office / Factory Address]`
- `[Your Registered Business Address]` / `[Your Business Address]`
- `[Monday–Saturday, Your Working Hours]`
- `[3/7]` (return window days)
- `[DD/MM/YYYY]` (effective date)

## Regenerate

```bash
python3 docs/generate_kliqprint_doc.py
python3 docs/generate_kliqprint_doc_classic.py
```
