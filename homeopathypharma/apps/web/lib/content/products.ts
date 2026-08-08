export type ProductFaq = { q: string; a: string };
export type Product = {
  id: string;
  slug: string;
  name: string;
  remedySlug: string;
  remedyName: string;
  brandSlug: string;
  brandName: string;
  manufacturer: string;
  form: string;
  potency: string;
  packSize: string;
  source: string;
  mrpInr: number;
  priceInr: number;
  inStock: boolean;
  batchNote: string;
  directions: string;
  warnings: string;
  ingredients: string;
  storage: string;
  faqs: ProductFaq[];
  healthAreas: string[];
  category: string;
};

export const PRODUCTS: Product[] = [
  {
    "id": "prd_0001",
    "slug": "arnica-montana-dilution-200c-30ml-1",
    "name": "Arnica montana 200C Dilution (30 ml)",
    "remedySlug": "arnica-montana",
    "remedyName": "Arnica montana",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 105,
    "priceInr": 91,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Arnica montana in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0002",
    "slug": "arnica-montana-dilution-30c-100ml-2",
    "name": "Arnica montana 30C Dilution (100 ml)",
    "remedySlug": "arnica-montana",
    "remedyName": "Arnica montana",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "100 ml",
    "source": "Plant",
    "mrpInr": 120,
    "priceInr": 103,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Arnica montana in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0003",
    "slug": "aconitum-napellus-globules-30c-10g-3",
    "name": "Aconitum napellus 30C Globules (10 g)",
    "remedySlug": "aconitum-napellus",
    "remedyName": "Aconitum napellus",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "30C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 135,
    "priceInr": 115,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Aconitum napellus in globules preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0004",
    "slug": "aconitum-napellus-globules-200c-10g-4",
    "name": "Aconitum napellus 200C Globules (10 g)",
    "remedySlug": "aconitum-napellus",
    "remedyName": "Aconitum napellus",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "200C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 150,
    "priceInr": 127,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Aconitum napellus in globules preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0005",
    "slug": "nux-vomica-tablets-30c-25g-5",
    "name": "Nux vomica 30C Tablets (25 g)",
    "remedySlug": "nux-vomica",
    "remedyName": "Nux vomica",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Tablets",
    "potency": "30C",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 165,
    "priceInr": 139,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Nux vomica in tablets preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0006",
    "slug": "nux-vomica-mother-tincture-mt-30ml-6",
    "name": "Nux vomica \u00d8 Mother Tincture (30 ml)",
    "remedySlug": "nux-vomica",
    "remedyName": "Nux vomica",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Mother Tincture",
    "potency": "\u00d8",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 180,
    "priceInr": 151,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Nux vomica in mother tincture preparation (\u00d8). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0007",
    "slug": "belladonna-ointment-\u2014-25g-7",
    "name": "Belladonna \u2014 Ointment (25 g)",
    "remedySlug": "belladonna",
    "remedyName": "Belladonna",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Ointment",
    "potency": "\u2014",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 195,
    "priceInr": 163,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Belladonna in ointment preparation (\u2014). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0008",
    "slug": "belladonna-biochemic-tablet-6x-25g-8",
    "name": "Belladonna 6X Biochemic tablet (25 g)",
    "remedySlug": "belladonna",
    "remedyName": "Belladonna",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Biochemic tablet",
    "potency": "6X",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 210,
    "priceInr": 175,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Belladonna in biochemic tablet preparation (6X). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Biochemic / Tissue Salts"
  },
  {
    "id": "prd_0009",
    "slug": "bryonia-alba-dilution-30c-30ml-9",
    "name": "Bryonia alba 30C Dilution (30 ml)",
    "remedySlug": "bryonia-alba",
    "remedyName": "Bryonia alba",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 225,
    "priceInr": 187,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Bryonia alba in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0010",
    "slug": "bryonia-alba-dilution-200c-30ml-10",
    "name": "Bryonia alba 200C Dilution (30 ml)",
    "remedySlug": "bryonia-alba",
    "remedyName": "Bryonia alba",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 240,
    "priceInr": 199,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Bryonia alba in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0011",
    "slug": "pulsatilla-dilution-30c-100ml-11",
    "name": "Pulsatilla nigricans 30C Dilution (100 ml)",
    "remedySlug": "pulsatilla",
    "remedyName": "Pulsatilla nigricans",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "100 ml",
    "source": "Plant",
    "mrpInr": 255,
    "priceInr": 211,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Pulsatilla nigricans in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0012",
    "slug": "pulsatilla-globules-30c-10g-12",
    "name": "Pulsatilla nigricans 30C Globules (10 g)",
    "remedySlug": "pulsatilla",
    "remedyName": "Pulsatilla nigricans",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "30C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 270,
    "priceInr": 223,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Pulsatilla nigricans in globules preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0013",
    "slug": "rhus-tox-globules-200c-10g-13",
    "name": "Rhus toxicodendron 200C Globules (10 g)",
    "remedySlug": "rhus-tox",
    "remedyName": "Rhus toxicodendron",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "200C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 285,
    "priceInr": 235,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Rhus toxicodendron in globules preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0014",
    "slug": "rhus-tox-tablets-30c-25g-14",
    "name": "Rhus toxicodendron 30C Tablets (25 g)",
    "remedySlug": "rhus-tox",
    "remedyName": "Rhus toxicodendron",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Tablets",
    "potency": "30C",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 300,
    "priceInr": 247,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Rhus toxicodendron in tablets preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0015",
    "slug": "gelsemium-mother-tincture-mt-30ml-15",
    "name": "Gelsemium sempervirens \u00d8 Mother Tincture (30 ml)",
    "remedySlug": "gelsemium",
    "remedyName": "Gelsemium sempervirens",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Mother Tincture",
    "potency": "\u00d8",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 315,
    "priceInr": 259,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Gelsemium sempervirens in mother tincture preparation (\u00d8). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0016",
    "slug": "gelsemium-ointment-\u2014-25g-16",
    "name": "Gelsemium sempervirens \u2014 Ointment (25 g)",
    "remedySlug": "gelsemium",
    "remedyName": "Gelsemium sempervirens",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Ointment",
    "potency": "\u2014",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 330,
    "priceInr": 271,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Gelsemium sempervirens in ointment preparation (\u2014). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0017",
    "slug": "gelsemium-biochemic-tablet-6x-25g-17",
    "name": "Gelsemium sempervirens 6X Biochemic tablet (25 g)",
    "remedySlug": "gelsemium",
    "remedyName": "Gelsemium sempervirens",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Biochemic tablet",
    "potency": "6X",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 345,
    "priceInr": 283,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Gelsemium sempervirens in biochemic tablet preparation (6X). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Biochemic / Tissue Salts"
  },
  {
    "id": "prd_0018",
    "slug": "hepar-sulph-dilution-30c-30ml-18",
    "name": "Hepar sulphuris 30C Dilution (30 ml)",
    "remedySlug": "hepar-sulph",
    "remedyName": "Hepar sulphuris",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 360,
    "priceInr": 295,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Hepar sulphuris in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0019",
    "slug": "hepar-sulph-dilution-200c-30ml-19",
    "name": "Hepar sulphuris 200C Dilution (30 ml)",
    "remedySlug": "hepar-sulph",
    "remedyName": "Hepar sulphuris",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 375,
    "priceInr": 307,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Hepar sulphuris in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0020",
    "slug": "mercurius-solubilis-dilution-30c-100ml-20",
    "name": "Mercurius solubilis 30C Dilution (100 ml)",
    "remedySlug": "mercurius-solubilis",
    "remedyName": "Mercurius solubilis",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "100 ml",
    "source": "Mineral",
    "mrpInr": 90,
    "priceInr": 79,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Mercurius solubilis in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0021",
    "slug": "mercurius-solubilis-globules-30c-10g-21",
    "name": "Mercurius solubilis 30C Globules (10 g)",
    "remedySlug": "mercurius-solubilis",
    "remedyName": "Mercurius solubilis",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "30C",
    "packSize": "10 g",
    "source": "Mineral",
    "mrpInr": 105,
    "priceInr": 91,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Mercurius solubilis in globules preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0022",
    "slug": "sulphur-globules-200c-10g-22",
    "name": "Sulphur 200C Globules (10 g)",
    "remedySlug": "sulphur",
    "remedyName": "Sulphur",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "200C",
    "packSize": "10 g",
    "source": "Mineral",
    "mrpInr": 120,
    "priceInr": 103,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Sulphur in globules preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "skin-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0023",
    "slug": "sulphur-tablets-30c-25g-23",
    "name": "Sulphur 30C Tablets (25 g)",
    "remedySlug": "sulphur",
    "remedyName": "Sulphur",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Tablets",
    "potency": "30C",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 135,
    "priceInr": 115,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Sulphur in tablets preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "skin-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0024",
    "slug": "calcarea-carbonica-mother-tincture-mt-30ml-24",
    "name": "Calcarea carbonica \u00d8 Mother Tincture (30 ml)",
    "remedySlug": "calcarea-carbonica",
    "remedyName": "Calcarea carbonica",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Mother Tincture",
    "potency": "\u00d8",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 150,
    "priceInr": 127,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Calcarea carbonica in mother tincture preparation (\u00d8). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0025",
    "slug": "calcarea-carbonica-ointment-\u2014-25g-25",
    "name": "Calcarea carbonica \u2014 Ointment (25 g)",
    "remedySlug": "calcarea-carbonica",
    "remedyName": "Calcarea carbonica",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Ointment",
    "potency": "\u2014",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 165,
    "priceInr": 139,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Calcarea carbonica in ointment preparation (\u2014). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0026",
    "slug": "calcarea-carbonica-biochemic-tablet-6x-25g-26",
    "name": "Calcarea carbonica 6X Biochemic tablet (25 g)",
    "remedySlug": "calcarea-carbonica",
    "remedyName": "Calcarea carbonica",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Biochemic tablet",
    "potency": "6X",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 180,
    "priceInr": 151,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Calcarea carbonica in biochemic tablet preparation (6X). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Biochemic / Tissue Salts"
  },
  {
    "id": "prd_0027",
    "slug": "natrum-muriaticum-dilution-30c-30ml-27",
    "name": "Natrum muriaticum 30C Dilution (30 ml)",
    "remedySlug": "natrum-muriaticum",
    "remedyName": "Natrum muriaticum",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 195,
    "priceInr": 163,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Natrum muriaticum in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0028",
    "slug": "natrum-muriaticum-dilution-200c-30ml-28",
    "name": "Natrum muriaticum 200C Dilution (30 ml)",
    "remedySlug": "natrum-muriaticum",
    "remedyName": "Natrum muriaticum",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 210,
    "priceInr": 175,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Natrum muriaticum in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0029",
    "slug": "natrum-muriaticum-dilution-30c-100ml-29",
    "name": "Natrum muriaticum 30C Dilution (100 ml)",
    "remedySlug": "natrum-muriaticum",
    "remedyName": "Natrum muriaticum",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "100 ml",
    "source": "Mineral",
    "mrpInr": 225,
    "priceInr": 187,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Natrum muriaticum in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0030",
    "slug": "kali-phosphoricum-globules-30c-10g-30",
    "name": "Kali phosphoricum 30C Globules (10 g)",
    "remedySlug": "kali-phosphoricum",
    "remedyName": "Kali phosphoricum",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "30C",
    "packSize": "10 g",
    "source": "Mineral",
    "mrpInr": 240,
    "priceInr": 199,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Kali phosphoricum in globules preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0031",
    "slug": "kali-phosphoricum-globules-200c-10g-31",
    "name": "Kali phosphoricum 200C Globules (10 g)",
    "remedySlug": "kali-phosphoricum",
    "remedyName": "Kali phosphoricum",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "200C",
    "packSize": "10 g",
    "source": "Mineral",
    "mrpInr": 255,
    "priceInr": 211,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Kali phosphoricum in globules preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0032",
    "slug": "kali-phosphoricum-tablets-30c-25g-32",
    "name": "Kali phosphoricum 30C Tablets (25 g)",
    "remedySlug": "kali-phosphoricum",
    "remedyName": "Kali phosphoricum",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Tablets",
    "potency": "30C",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 270,
    "priceInr": 223,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Kali phosphoricum in tablets preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0033",
    "slug": "silicea-mother-tincture-mt-30ml-33",
    "name": "Silicea \u00d8 Mother Tincture (30 ml)",
    "remedySlug": "silicea",
    "remedyName": "Silicea",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Mother Tincture",
    "potency": "\u00d8",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 285,
    "priceInr": 235,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Silicea in mother tincture preparation (\u00d8). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0034",
    "slug": "silicea-ointment-\u2014-25g-34",
    "name": "Silicea \u2014 Ointment (25 g)",
    "remedySlug": "silicea",
    "remedyName": "Silicea",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Ointment",
    "potency": "\u2014",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 300,
    "priceInr": 247,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Silicea in ointment preparation (\u2014). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0035",
    "slug": "silicea-biochemic-tablet-6x-25g-35",
    "name": "Silicea 6X Biochemic tablet (25 g)",
    "remedySlug": "silicea",
    "remedyName": "Silicea",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Biochemic tablet",
    "potency": "6X",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 315,
    "priceInr": 259,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Silicea in biochemic tablet preparation (6X). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Biochemic / Tissue Salts"
  },
  {
    "id": "prd_0036",
    "slug": "chamomilla-dilution-30c-30ml-36",
    "name": "Chamomilla 30C Dilution (30 ml)",
    "remedySlug": "chamomilla",
    "remedyName": "Chamomilla",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 330,
    "priceInr": 271,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Chamomilla in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0037",
    "slug": "chamomilla-dilution-200c-30ml-37",
    "name": "Chamomilla 200C Dilution (30 ml)",
    "remedySlug": "chamomilla",
    "remedyName": "Chamomilla",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 345,
    "priceInr": 283,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Chamomilla in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0038",
    "slug": "cina-dilution-30c-100ml-38",
    "name": "Cina 30C Dilution (100 ml)",
    "remedySlug": "cina",
    "remedyName": "Cina",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "100 ml",
    "source": "Plant",
    "mrpInr": 360,
    "priceInr": 295,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Cina in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0039",
    "slug": "cina-globules-30c-10g-39",
    "name": "Cina 30C Globules (10 g)",
    "remedySlug": "cina",
    "remedyName": "Cina",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "30C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 375,
    "priceInr": 307,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Cina in globules preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0040",
    "slug": "drosera-globules-200c-10g-40",
    "name": "Drosera rotundifolia 200C Globules (10 g)",
    "remedySlug": "drosera",
    "remedyName": "Drosera rotundifolia",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "200C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 90,
    "priceInr": 79,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Drosera rotundifolia in globules preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0041",
    "slug": "drosera-tablets-30c-25g-41",
    "name": "Drosera rotundifolia 30C Tablets (25 g)",
    "remedySlug": "drosera",
    "remedyName": "Drosera rotundifolia",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Tablets",
    "potency": "30C",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 105,
    "priceInr": 91,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Drosera rotundifolia in tablets preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0042",
    "slug": "antimonium-tart-mother-tincture-mt-30ml-42",
    "name": "Antimonium tartaricum \u00d8 Mother Tincture (30 ml)",
    "remedySlug": "antimonium-tart",
    "remedyName": "Antimonium tartaricum",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Mother Tincture",
    "potency": "\u00d8",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 120,
    "priceInr": 103,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Antimonium tartaricum in mother tincture preparation (\u00d8). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0043",
    "slug": "antimonium-tart-ointment-\u2014-25g-43",
    "name": "Antimonium tartaricum \u2014 Ointment (25 g)",
    "remedySlug": "antimonium-tart",
    "remedyName": "Antimonium tartaricum",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Ointment",
    "potency": "\u2014",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 135,
    "priceInr": 115,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Antimonium tartaricum in ointment preparation (\u2014). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0044",
    "slug": "antimonium-tart-biochemic-tablet-6x-25g-44",
    "name": "Antimonium tartaricum 6X Biochemic tablet (25 g)",
    "remedySlug": "antimonium-tart",
    "remedyName": "Antimonium tartaricum",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Biochemic tablet",
    "potency": "6X",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 150,
    "priceInr": 127,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Antimonium tartaricum in biochemic tablet preparation (6X). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Biochemic / Tissue Salts"
  },
  {
    "id": "prd_0045",
    "slug": "arsenicum-album-dilution-30c-30ml-45",
    "name": "Arsenicum album 30C Dilution (30 ml)",
    "remedySlug": "arsenicum-album",
    "remedyName": "Arsenicum album",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 165,
    "priceInr": 139,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Arsenicum album in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0046",
    "slug": "arsenicum-album-dilution-200c-30ml-46",
    "name": "Arsenicum album 200C Dilution (30 ml)",
    "remedySlug": "arsenicum-album",
    "remedyName": "Arsenicum album",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 180,
    "priceInr": 151,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Arsenicum album in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0047",
    "slug": "phosphorus-dilution-30c-100ml-47",
    "name": "Phosphorus 30C Dilution (100 ml)",
    "remedySlug": "phosphorus",
    "remedyName": "Phosphorus",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "100 ml",
    "source": "Mineral",
    "mrpInr": 195,
    "priceInr": 163,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Phosphorus in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0048",
    "slug": "phosphorus-globules-30c-10g-48",
    "name": "Phosphorus 30C Globules (10 g)",
    "remedySlug": "phosphorus",
    "remedyName": "Phosphorus",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "30C",
    "packSize": "10 g",
    "source": "Mineral",
    "mrpInr": 210,
    "priceInr": 175,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Phosphorus in globules preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0049",
    "slug": "lycopodium-globules-200c-10g-49",
    "name": "Lycopodium clavatum 200C Globules (10 g)",
    "remedySlug": "lycopodium",
    "remedyName": "Lycopodium clavatum",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "200C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 225,
    "priceInr": 187,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Lycopodium clavatum in globules preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0050",
    "slug": "lycopodium-tablets-30c-25g-50",
    "name": "Lycopodium clavatum 30C Tablets (25 g)",
    "remedySlug": "lycopodium",
    "remedyName": "Lycopodium clavatum",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Tablets",
    "potency": "30C",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 240,
    "priceInr": 199,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Lycopodium clavatum in tablets preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0051",
    "slug": "carbo-veg-mother-tincture-mt-30ml-51",
    "name": "Carbo vegetabilis \u00d8 Mother Tincture (30 ml)",
    "remedySlug": "carbo-veg",
    "remedyName": "Carbo vegetabilis",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Mother Tincture",
    "potency": "\u00d8",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 255,
    "priceInr": 211,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Carbo vegetabilis in mother tincture preparation (\u00d8). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0052",
    "slug": "carbo-veg-ointment-\u2014-25g-52",
    "name": "Carbo vegetabilis \u2014 Ointment (25 g)",
    "remedySlug": "carbo-veg",
    "remedyName": "Carbo vegetabilis",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Ointment",
    "potency": "\u2014",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 270,
    "priceInr": 223,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Carbo vegetabilis in ointment preparation (\u2014). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0053",
    "slug": "carbo-veg-biochemic-tablet-6x-25g-53",
    "name": "Carbo vegetabilis 6X Biochemic tablet (25 g)",
    "remedySlug": "carbo-veg",
    "remedyName": "Carbo vegetabilis",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Biochemic tablet",
    "potency": "6X",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 285,
    "priceInr": 235,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Carbo vegetabilis in biochemic tablet preparation (6X). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Biochemic / Tissue Salts"
  },
  {
    "id": "prd_0054",
    "slug": "ipecac-dilution-30c-30ml-54",
    "name": "Ipecacuanha 30C Dilution (30 ml)",
    "remedySlug": "ipecac",
    "remedyName": "Ipecacuanha",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 300,
    "priceInr": 247,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Ipecacuanha in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0055",
    "slug": "ipecac-dilution-200c-30ml-55",
    "name": "Ipecacuanha 200C Dilution (30 ml)",
    "remedySlug": "ipecac",
    "remedyName": "Ipecacuanha",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 315,
    "priceInr": 259,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Ipecacuanha in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0056",
    "slug": "colocynthis-dilution-30c-100ml-56",
    "name": "Colocynthis 30C Dilution (100 ml)",
    "remedySlug": "colocynthis",
    "remedyName": "Colocynthis",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "100 ml",
    "source": "Plant",
    "mrpInr": 330,
    "priceInr": 271,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Colocynthis in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0057",
    "slug": "colocynthis-globules-30c-10g-57",
    "name": "Colocynthis 30C Globules (10 g)",
    "remedySlug": "colocynthis",
    "remedyName": "Colocynthis",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "30C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 345,
    "priceInr": 283,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Colocynthis in globules preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0058",
    "slug": "magnesia-phosphorica-globules-200c-10g-58",
    "name": "Mag phos 200C Globules (10 g)",
    "remedySlug": "magnesia-phosphorica",
    "remedyName": "Mag phos",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "200C",
    "packSize": "10 g",
    "source": "Mineral",
    "mrpInr": 360,
    "priceInr": 295,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Mag phos in globules preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0059",
    "slug": "magnesia-phosphorica-tablets-30c-25g-59",
    "name": "Mag phos 30C Tablets (25 g)",
    "remedySlug": "magnesia-phosphorica",
    "remedyName": "Mag phos",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Tablets",
    "potency": "30C",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 375,
    "priceInr": 307,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Mag phos in tablets preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0060",
    "slug": "magnesia-phosphorica-mother-tincture-mt-30ml-60",
    "name": "Mag phos \u00d8 Mother Tincture (30 ml)",
    "remedySlug": "magnesia-phosphorica",
    "remedyName": "Mag phos",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Mother Tincture",
    "potency": "\u00d8",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 90,
    "priceInr": 79,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Mag phos in mother tincture preparation (\u00d8). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0061",
    "slug": "ferrum-phos-ointment-\u2014-25g-61",
    "name": "Ferrum phosphoricum \u2014 Ointment (25 g)",
    "remedySlug": "ferrum-phos",
    "remedyName": "Ferrum phosphoricum",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Ointment",
    "potency": "\u2014",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 105,
    "priceInr": 91,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Ferrum phosphoricum in ointment preparation (\u2014). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0062",
    "slug": "ferrum-phos-biochemic-tablet-6x-25g-62",
    "name": "Ferrum phosphoricum 6X Biochemic tablet (25 g)",
    "remedySlug": "ferrum-phos",
    "remedyName": "Ferrum phosphoricum",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Biochemic tablet",
    "potency": "6X",
    "packSize": "25 g",
    "source": "Mineral",
    "mrpInr": 120,
    "priceInr": 103,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Ferrum phosphoricum in biochemic tablet preparation (6X). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Biochemic / Tissue Salts"
  },
  {
    "id": "prd_0063",
    "slug": "ferrum-phos-dilution-30c-30ml-63",
    "name": "Ferrum phosphoricum 30C Dilution (30 ml)",
    "remedySlug": "ferrum-phos",
    "remedyName": "Ferrum phosphoricum",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "30 ml",
    "source": "Mineral",
    "mrpInr": 135,
    "priceInr": 115,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Ferrum phosphoricum in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0064",
    "slug": "thuja-dilution-200c-30ml-64",
    "name": "Thuja occidentalis 200C Dilution (30 ml)",
    "remedySlug": "thuja",
    "remedyName": "Thuja occidentalis",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 150,
    "priceInr": 127,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Thuja occidentalis in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "skin-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0065",
    "slug": "thuja-dilution-30c-100ml-65",
    "name": "Thuja occidentalis 30C Dilution (100 ml)",
    "remedySlug": "thuja",
    "remedyName": "Thuja occidentalis",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "100 ml",
    "source": "Plant",
    "mrpInr": 165,
    "priceInr": 139,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Thuja occidentalis in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "skin-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0066",
    "slug": "hypericum-globules-30c-10g-66",
    "name": "Hypericum perforatum 30C Globules (10 g)",
    "remedySlug": "hypericum",
    "remedyName": "Hypericum perforatum",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "30C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 180,
    "priceInr": 151,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Hypericum perforatum in globules preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0067",
    "slug": "hypericum-globules-200c-10g-67",
    "name": "Hypericum perforatum 200C Globules (10 g)",
    "remedySlug": "hypericum",
    "remedyName": "Hypericum perforatum",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "200C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 195,
    "priceInr": 163,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Hypericum perforatum in globules preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0068",
    "slug": "ledum-tablets-30c-25g-68",
    "name": "Ledum palustre 30C Tablets (25 g)",
    "remedySlug": "ledum",
    "remedyName": "Ledum palustre",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Tablets",
    "potency": "30C",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 210,
    "priceInr": 175,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Ledum palustre in tablets preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0069",
    "slug": "ledum-mother-tincture-mt-30ml-69",
    "name": "Ledum palustre \u00d8 Mother Tincture (30 ml)",
    "remedySlug": "ledum",
    "remedyName": "Ledum palustre",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Mother Tincture",
    "potency": "\u00d8",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 225,
    "priceInr": 187,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Ledum palustre in mother tincture preparation (\u00d8). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0070",
    "slug": "apis-mellifica-ointment-\u2014-25g-70",
    "name": "Apis mellifica \u2014 Ointment (25 g)",
    "remedySlug": "apis-mellifica",
    "remedyName": "Apis mellifica",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Ointment",
    "potency": "\u2014",
    "packSize": "25 g",
    "source": "Animal",
    "mrpInr": 240,
    "priceInr": 199,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Apis mellifica in ointment preparation (\u2014). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0071",
    "slug": "apis-mellifica-biochemic-tablet-6x-25g-71",
    "name": "Apis mellifica 6X Biochemic tablet (25 g)",
    "remedySlug": "apis-mellifica",
    "remedyName": "Apis mellifica",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Biochemic tablet",
    "potency": "6X",
    "packSize": "25 g",
    "source": "Animal",
    "mrpInr": 255,
    "priceInr": 211,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Apis mellifica in biochemic tablet preparation (6X). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Biochemic / Tissue Salts"
  },
  {
    "id": "prd_0072",
    "slug": "sepia-dilution-30c-30ml-72",
    "name": "Sepia 30C Dilution (30 ml)",
    "remedySlug": "sepia",
    "remedyName": "Sepia",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "30 ml",
    "source": "Animal",
    "mrpInr": 270,
    "priceInr": 223,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Sepia in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0073",
    "slug": "sepia-dilution-200c-30ml-73",
    "name": "Sepia 200C Dilution (30 ml)",
    "remedySlug": "sepia",
    "remedyName": "Sepia",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Animal",
    "mrpInr": 285,
    "priceInr": 235,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Sepia in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0074",
    "slug": "lachesis-dilution-30c-100ml-74",
    "name": "Lachesis 30C Dilution (100 ml)",
    "remedySlug": "lachesis",
    "remedyName": "Lachesis",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "100 ml",
    "source": "Animal",
    "mrpInr": 300,
    "priceInr": 247,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Lachesis in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0075",
    "slug": "lachesis-globules-30c-10g-75",
    "name": "Lachesis 30C Globules (10 g)",
    "remedySlug": "lachesis",
    "remedyName": "Lachesis",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "30C",
    "packSize": "10 g",
    "source": "Animal",
    "mrpInr": 315,
    "priceInr": 259,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Lachesis in globules preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0076",
    "slug": "croton-tiglium-globules-200c-10g-76",
    "name": "Croton tiglium 200C Globules (10 g)",
    "remedySlug": "croton-tiglium",
    "remedyName": "Croton tiglium",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "200C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 330,
    "priceInr": 271,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Croton tiglium in globules preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0077",
    "slug": "croton-tiglium-tablets-30c-25g-77",
    "name": "Croton tiglium 30C Tablets (25 g)",
    "remedySlug": "croton-tiglium",
    "remedyName": "Croton tiglium",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Tablets",
    "potency": "30C",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 345,
    "priceInr": 283,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Croton tiglium in tablets preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0078",
    "slug": "podophyllum-mother-tincture-mt-30ml-78",
    "name": "Podophyllum \u00d8 Mother Tincture (30 ml)",
    "remedySlug": "podophyllum",
    "remedyName": "Podophyllum",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Mother Tincture",
    "potency": "\u00d8",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 360,
    "priceInr": 295,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Podophyllum in mother tincture preparation (\u00d8). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0079",
    "slug": "podophyllum-ointment-\u2014-25g-79",
    "name": "Podophyllum \u2014 Ointment (25 g)",
    "remedySlug": "podophyllum",
    "remedyName": "Podophyllum",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Ointment",
    "potency": "\u2014",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 375,
    "priceInr": 307,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Podophyllum in ointment preparation (\u2014). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0080",
    "slug": "podophyllum-biochemic-tablet-6x-25g-80",
    "name": "Podophyllum 6X Biochemic tablet (25 g)",
    "remedySlug": "podophyllum",
    "remedyName": "Podophyllum",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Biochemic tablet",
    "potency": "6X",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 90,
    "priceInr": 79,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Podophyllum in biochemic tablet preparation (6X). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Biochemic / Tissue Salts"
  },
  {
    "id": "prd_0081",
    "slug": "allium-cepa-dilution-30c-30ml-81",
    "name": "Allium cepa 30C Dilution (30 ml)",
    "remedySlug": "allium-cepa",
    "remedyName": "Allium cepa",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 105,
    "priceInr": 91,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Allium cepa in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0082",
    "slug": "allium-cepa-dilution-200c-30ml-82",
    "name": "Allium cepa 200C Dilution (30 ml)",
    "remedySlug": "allium-cepa",
    "remedyName": "Allium cepa",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 120,
    "priceInr": 103,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Allium cepa in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0083",
    "slug": "euphrasia-dilution-30c-100ml-83",
    "name": "Euphrasia 30C Dilution (100 ml)",
    "remedySlug": "euphrasia",
    "remedyName": "Euphrasia",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "100 ml",
    "source": "Plant",
    "mrpInr": 135,
    "priceInr": 115,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Euphrasia in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0084",
    "slug": "euphrasia-globules-30c-10g-84",
    "name": "Euphrasia 30C Globules (10 g)",
    "remedySlug": "euphrasia",
    "remedyName": "Euphrasia",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "30C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 150,
    "priceInr": 127,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Euphrasia in globules preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0085",
    "slug": "sabadilla-globules-200c-10g-85",
    "name": "Sabadilla 200C Globules (10 g)",
    "remedySlug": "sabadilla",
    "remedyName": "Sabadilla",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Globules",
    "potency": "200C",
    "packSize": "10 g",
    "source": "Plant",
    "mrpInr": 165,
    "priceInr": 139,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Sabadilla in globules preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0086",
    "slug": "sabadilla-tablets-30c-25g-86",
    "name": "Sabadilla 30C Tablets (25 g)",
    "remedySlug": "sabadilla",
    "remedyName": "Sabadilla",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Tablets",
    "potency": "30C",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 180,
    "priceInr": 151,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Sabadilla in tablets preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "general-wellness"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0087",
    "slug": "spongia-mother-tincture-mt-30ml-87",
    "name": "Spongia tosta \u00d8 Mother Tincture (30 ml)",
    "remedySlug": "spongia",
    "remedyName": "Spongia tosta",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Mother Tincture",
    "potency": "\u00d8",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 195,
    "priceInr": 163,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Spongia tosta in mother tincture preparation (\u00d8). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0088",
    "slug": "spongia-ointment-\u2014-25g-88",
    "name": "Spongia tosta \u2014 Ointment (25 g)",
    "remedySlug": "spongia",
    "remedyName": "Spongia tosta",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Ointment",
    "potency": "\u2014",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 210,
    "priceInr": 175,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Spongia tosta in ointment preparation (\u2014). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0089",
    "slug": "spongia-biochemic-tablet-6x-25g-89",
    "name": "Spongia tosta 6X Biochemic tablet (25 g)",
    "remedySlug": "spongia",
    "remedyName": "Spongia tosta",
    "brandSlug": "coastal-biochemic",
    "brandName": "Coastal Biochemic",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Biochemic tablet",
    "potency": "6X",
    "packSize": "25 g",
    "source": "Plant",
    "mrpInr": 225,
    "priceInr": 187,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Spongia tosta in biochemic tablet preparation (6X). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Biochemic / Tissue Salts"
  },
  {
    "id": "prd_0090",
    "slug": "rumex-dilution-30c-30ml-90",
    "name": "Rumex crispus 30C Dilution (30 ml)",
    "remedySlug": "rumex",
    "remedyName": "Rumex crispus",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "30C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 240,
    "priceInr": 199,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Rumex crispus in dilution preparation (30C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0091",
    "slug": "rumex-dilution-200c-30ml-91",
    "name": "Rumex crispus 200C Dilution (30 ml)",
    "remedySlug": "rumex",
    "remedyName": "Rumex crispus",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "Licensed contract manufacturer \u00b7 Maharashtra",
    "form": "Dilution",
    "potency": "200C",
    "packSize": "30 ml",
    "source": "Plant",
    "mrpInr": 255,
    "priceInr": 211,
    "inStock": true,
    "batchNote": "Batch & expiry printed on pack \u00b7 FEFO warehouse dispatch",
    "directions": "Use as directed on the label or by a qualified practitioner. Do not self-prescribe for serious symptoms.",
    "warnings": "For oral or external use as labelled only. Not for injection. Keep out of reach of children. Seek medical care for emergencies, pregnancy-related concerns, or worsening symptoms. Educational listing \u2014 not a cure claim.",
    "ingredients": "Rumex crispus in dilution preparation (200C). Excipients as per label.",
    "storage": "Store in a cool, dry place away from strong odours and direct sunlight.",
    "faqs": [
      {
        "q": "Is this a prescription medicine?",
        "a": "Labelling and local rules apply. Follow pack instructions and consult a qualified practitioner when unsure."
      },
      {
        "q": "Can I use it for pets?",
        "a": "Only use products and advice intended for animals under a qualified veterinary professional."
      },
      {
        "q": "What if symptoms persist?",
        "a": "Stop self-care experimentation and consult a qualified healthcare professional promptly."
      }
    ],
    "healthAreas": [
      "respiratory-health"
    ],
    "category": "Single Remedies"
  },
  {
    "id": "prd_0092",
    "slug": "family-winter-wellness-kit",
    "name": "Family Winter Wellness Kit",
    "remedySlug": "arnica-montana",
    "remedyName": "Assorted",
    "brandSlug": "homeopathypharma-essentials",
    "brandName": "HomeopathyPharma Essentials",
    "manufacturer": "HomeopathyPharma fulfilment",
    "form": "Bundle",
    "potency": "\u2014",
    "packSize": "1 kit",
    "source": "Combination",
    "mrpInr": 1299,
    "priceInr": 999,
    "inStock": true,
    "batchNote": "Kit components listed on insert",
    "directions": "Follow individual product labels inside the kit.",
    "warnings": "Not a substitute for veterinary or medical care. Educational retail kit.",
    "ingredients": "See component labels.",
    "storage": "Cool, dry place.",
    "faqs": [
      {
        "q": "What is included?",
        "a": "See the kit insert for the exact component list and potencies."
      }
    ],
    "healthAreas": [
      "general-wellness",
      "respiratory-health"
    ],
    "category": "Bundles"
  },
  {
    "id": "prd_0093",
    "slug": "digestive-care-starter",
    "name": "Digestive Care Starter Pack",
    "remedySlug": "nux-vomica",
    "remedyName": "Assorted",
    "brandSlug": "harbour-leaf-remedies",
    "brandName": "Harbour Leaf Remedies",
    "manufacturer": "HomeopathyPharma fulfilment",
    "form": "Bundle",
    "potency": "\u2014",
    "packSize": "1 kit",
    "source": "Combination",
    "mrpInr": 899,
    "priceInr": 749,
    "inStock": true,
    "batchNote": "Kit components listed on insert",
    "directions": "Follow individual product labels inside the kit.",
    "warnings": "Not a substitute for veterinary or medical care. Educational retail kit.",
    "ingredients": "See component labels.",
    "storage": "Cool, dry place.",
    "faqs": [
      {
        "q": "What is included?",
        "a": "See the kit insert for the exact component list and potencies."
      }
    ],
    "healthAreas": [
      "digestive-health"
    ],
    "category": "Bundles"
  },
  {
    "id": "prd_0094",
    "slug": "pet-calm-travel-pack-dogs",
    "name": "Dog Travel Comfort Pack",
    "remedySlug": "arnica-montana",
    "remedyName": "Assorted",
    "brandSlug": "saffron-grove-care",
    "brandName": "Saffron Grove Care",
    "manufacturer": "HomeopathyPharma fulfilment",
    "form": "Bundle",
    "potency": "\u2014",
    "packSize": "1 kit",
    "source": "Combination",
    "mrpInr": 799,
    "priceInr": 649,
    "inStock": true,
    "batchNote": "Kit components listed on insert",
    "directions": "Follow individual product labels inside the kit.",
    "warnings": "Not a substitute for veterinary or medical care. Educational retail kit.",
    "ingredients": "See component labels.",
    "storage": "Cool, dry place.",
    "faqs": [
      {
        "q": "What is included?",
        "a": "See the kit insert for the exact component list and potencies."
      }
    ],
    "healthAreas": [
      "pet-care"
    ],
    "category": "Pet Care"
  }
];

export function getProduct(slug: string) { return PRODUCTS.find(p => p.slug === slug); }
export function listProductSlugs() { return PRODUCTS.map(p => p.slug); }
export function productsByBrand(brandSlug: string) { return PRODUCTS.filter(p => p.brandSlug === brandSlug); }
export function productsByRemedy(remedySlug: string) { return PRODUCTS.filter(p => p.remedySlug === remedySlug); }
export function productsByHealthArea(area: string) { return PRODUCTS.filter(p => p.healthAreas.includes(area)); }
export function relatedProducts(slug: string, limit = 4) {
  const p = getProduct(slug);
  if (!p) return [];
  return PRODUCTS.filter(x => x.slug !== slug && (x.remedySlug === p.remedySlug || x.brandSlug === p.brandSlug)).slice(0, limit);
}
