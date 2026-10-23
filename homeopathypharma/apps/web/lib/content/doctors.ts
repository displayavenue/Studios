/**
 * Mumbai BHMS practitioner directory content for the live storefront.
 * Profiles are listed for discovery and booking requests.
 * Verified-badge issuance remains a backend admin workflow — do not invent verification here.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type DoctorProfile = {
  id: string;
  slug: string;
  title: string;
  fullName: string;
  credentials: string;
  city: string;
  state: string;
  locality: string;
  postalCode: string;
  clinicName: string;
  clinicAddress: string;
  specialties: string[];
  languages: string[];
  languageCodes: string[];
  yearsExperience: number;
  consultationFeeInr: number;
  formats: string[];
  bio: string;
  availabilityNote: string;
  responseTime: string;
  listed: boolean;
  verificationStatus: "LISTED" | "VERIFIED";
  acceptingPatients: boolean;
};

const DOCTOR_SEED: DoctorProfile[] = [
  {
    "id": "doc_001",
    "slug": "dr-aarav-sharma-001",
    "title": "Dr.",
    "fullName": "Dr. Aarav Sharma",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Andheri West",
    "postalCode": "400058",
    "clinicName": "Andheri West Homeopathy Clinic",
    "clinicAddress": "1, Main Road, Andheri West, Mumbai 400058",
    "specialties": [
      "General Homeopathy",
      "Men's Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 3,
    "consultationFeeInr": 299,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Aarav Sharma, BHMS, practices homeopathy in Andheri West, Mumbai, with 3 years of clinical experience. Focus areas include general homeopathy, men's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_002",
    "slug": "dr-aditi-nair-002",
    "title": "Dr.",
    "fullName": "Dr. Aditi Nair",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Andheri East",
    "postalCode": "400069",
    "clinicName": "Andheri East Homeopathy Clinic",
    "clinicAddress": "2, Main Road, Andheri East, Mumbai 400069",
    "specialties": [
      "Pediatric Homeopathy",
      "Skin & Dermatology support"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 4,
    "consultationFeeInr": 349,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Aditi Nair, BHMS, practices homeopathy in Andheri East, Mumbai, with 4 years of clinical experience. Focus areas include pediatric homeopathy, skin & dermatology support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_003",
    "slug": "dr-ananya-banerjee-003",
    "title": "Dr.",
    "fullName": "Dr. Ananya Banerjee",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Bandra West",
    "postalCode": "400050",
    "clinicName": "Bandra West Homeopathy Clinic",
    "clinicAddress": "3, Main Road, Bandra West, Mumbai 400050",
    "specialties": [
      "Women's Health",
      "Digestive Health"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 5,
    "consultationFeeInr": 399,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Ananya Banerjee, BHMS, practices homeopathy in Bandra West, Mumbai, with 5 years of clinical experience. Focus areas include women's health, digestive health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_004",
    "slug": "dr-arjun-menon-004",
    "title": "Dr.",
    "fullName": "Dr. Arjun Menon",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Bandra East",
    "postalCode": "400051",
    "clinicName": "Bandra East Homeopathy Clinic",
    "clinicAddress": "4, Main Road, Bandra East, Mumbai 400051",
    "specialties": [
      "Men's Health",
      "Respiratory Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 6,
    "consultationFeeInr": 449,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Arjun Menon, BHMS, practices homeopathy in Bandra East, Mumbai, with 6 years of clinical experience. Focus areas include men's health, respiratory health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_005",
    "slug": "dr-aisha-rodrigues-005",
    "title": "Dr.",
    "fullName": "Dr. Aisha Rodrigues",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Dadar West",
    "postalCode": "400028",
    "clinicName": "Dadar West Homeopathy Clinic",
    "clinicAddress": "5, Main Road, Dadar West, Mumbai 400028",
    "specialties": [
      "Skin & Dermatology support",
      "Joint & Musculoskeletal"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 7,
    "consultationFeeInr": 499,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Aisha Rodrigues, BHMS, practices homeopathy in Dadar West, Mumbai, with 7 years of clinical experience. Focus areas include skin & dermatology support, joint & musculoskeletal. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_006",
    "slug": "dr-bhavya-more-006",
    "title": "Dr.",
    "fullName": "Dr. Bhavya More",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Dadar East",
    "postalCode": "400014",
    "clinicName": "Dadar East Homeopathy Clinic",
    "clinicAddress": "6, Main Road, Dadar East, Mumbai 400014",
    "specialties": [
      "Digestive Health",
      "Lifestyle & Wellness"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 8,
    "consultationFeeInr": 549,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Bhavya More, BHMS, practices homeopathy in Dadar East, Mumbai, with 8 years of clinical experience. Focus areas include digestive health, lifestyle & wellness. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_007",
    "slug": "dr-chirag-bhatia-007",
    "title": "Dr.",
    "fullName": "Dr. Chirag Bhatia",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Powai",
    "postalCode": "400076",
    "clinicName": "Powai Homeopathy Clinic",
    "clinicAddress": "7, Main Road, Powai, Mumbai 400076",
    "specialties": [
      "Respiratory Health",
      "Senior Care"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 9,
    "consultationFeeInr": 599,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Chirag Bhatia, BHMS, practices homeopathy in Powai, Mumbai, with 9 years of clinical experience. Focus areas include respiratory health, senior care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_008",
    "slug": "dr-deepa-pandey-008",
    "title": "Dr.",
    "fullName": "Dr. Deepa Pandey",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Goregaon West",
    "postalCode": "400104",
    "clinicName": "Goregaon West Homeopathy Clinic",
    "clinicAddress": "8, Main Road, Goregaon West, Mumbai 400104",
    "specialties": [
      "Joint & Musculoskeletal",
      "Allergy-related care"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 10,
    "consultationFeeInr": 649,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Deepa Pandey, BHMS, practices homeopathy in Goregaon West, Mumbai, with 10 years of clinical experience. Focus areas include joint & musculoskeletal, allergy-related care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_009",
    "slug": "dr-dev-date-009",
    "title": "Dr.",
    "fullName": "Dr. Dev Date",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Goregaon East",
    "postalCode": "400063",
    "clinicName": "Goregaon East Homeopathy Clinic",
    "clinicAddress": "9, Main Road, Goregaon East, Mumbai 400063",
    "specialties": [
      "Lifestyle & Wellness",
      "Hair & Scalp"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 11,
    "consultationFeeInr": 699,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Dev Date, BHMS, practices homeopathy in Goregaon East, Mumbai, with 11 years of clinical experience. Focus areas include lifestyle & wellness, hair & scalp. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_010",
    "slug": "dr-diya-shah-010",
    "title": "Dr.",
    "fullName": "Dr. Diya Shah",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Malad West",
    "postalCode": "400064",
    "clinicName": "Malad West Homeopathy Clinic",
    "clinicAddress": "10, Main Road, Malad West, Mumbai 400064",
    "specialties": [
      "Senior Care",
      "Urinary Health"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 12,
    "consultationFeeInr": 749,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Diya Shah, BHMS, practices homeopathy in Malad West, Mumbai, with 12 years of clinical experience. Focus areas include senior care, urinary health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_011",
    "slug": "dr-esha-singh-011",
    "title": "Dr.",
    "fullName": "Dr. Esha Singh",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Kandivali West",
    "postalCode": "400067",
    "clinicName": "Kandivali West Homeopathy Clinic",
    "clinicAddress": "11, Main Road, Kandivali West, Mumbai 400067",
    "specialties": [
      "Allergy-related care",
      "Sleep & Stress support"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 13,
    "consultationFeeInr": 799,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Esha Singh, BHMS, practices homeopathy in Kandivali West, Mumbai, with 13 years of clinical experience. Focus areas include allergy-related care, sleep & stress support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_012",
    "slug": "dr-farhan-das-012",
    "title": "Dr.",
    "fullName": "Dr. Farhan Das",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Borivali West",
    "postalCode": "400092",
    "clinicName": "Borivali West Homeopathy Clinic",
    "clinicAddress": "12, Main Road, Borivali West, Mumbai 400092",
    "specialties": [
      "Hair & Scalp",
      "Family Practice"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 14,
    "consultationFeeInr": 849,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Farhan Das, BHMS, practices homeopathy in Borivali West, Mumbai, with 14 years of clinical experience. Focus areas include hair & scalp, family practice. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_013",
    "slug": "dr-gauri-shetty-013",
    "title": "Dr.",
    "fullName": "Dr. Gauri Shetty",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Thane West",
    "postalCode": "400601",
    "clinicName": "Thane West Homeopathy Clinic",
    "clinicAddress": "13, Main Road, Thane West, Mumbai 400601",
    "specialties": [
      "Urinary Health",
      "General Homeopathy"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 15,
    "consultationFeeInr": 299,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Gauri Shetty, BHMS, practices homeopathy in Thane West, Mumbai, with 15 years of clinical experience. Focus areas include urinary health, general homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_014",
    "slug": "dr-harsh-patil-014",
    "title": "Dr.",
    "fullName": "Dr. Harsh Patil",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Navi Mumbai \u2014 Vashi",
    "postalCode": "400703",
    "clinicName": "Navi Mumbai \u2014 Vashi Homeopathy Clinic",
    "clinicAddress": "14, Main Road, Navi Mumbai \u2014 Vashi, Mumbai 400703",
    "specialties": [
      "Sleep & Stress support",
      "Pediatric Homeopathy"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 16,
    "consultationFeeInr": 349,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Harsh Patil, BHMS, practices homeopathy in Navi Mumbai \u2014 Vashi, Mumbai, with 16 years of clinical experience. Focus areas include sleep & stress support, pediatric homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_015",
    "slug": "dr-isha-rane-015",
    "title": "Dr.",
    "fullName": "Dr. Isha Rane",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Navi Mumbai \u2014 Nerul",
    "postalCode": "400706",
    "clinicName": "Navi Mumbai \u2014 Nerul Homeopathy Clinic",
    "clinicAddress": "15, Main Road, Navi Mumbai \u2014 Nerul, Mumbai 400706",
    "specialties": [
      "Family Practice",
      "Women's Health"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 17,
    "consultationFeeInr": 399,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Isha Rane, BHMS, practices homeopathy in Navi Mumbai \u2014 Nerul, Mumbai, with 17 years of clinical experience. Focus areas include family practice, women's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_016",
    "slug": "dr-jatin-saxena-016",
    "title": "Dr.",
    "fullName": "Dr. Jatin Saxena",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Chembur",
    "postalCode": "400071",
    "clinicName": "Chembur Homeopathy Clinic",
    "clinicAddress": "16, Main Road, Chembur, Mumbai 400071",
    "specialties": [
      "General Homeopathy",
      "Men's Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 18,
    "consultationFeeInr": 449,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Jatin Saxena, BHMS, practices homeopathy in Chembur, Mumbai, with 18 years of clinical experience. Focus areas include general homeopathy, men's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_017",
    "slug": "dr-kavya-gokhale-017",
    "title": "Dr.",
    "fullName": "Dr. Kavya Gokhale",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Ghatkopar East",
    "postalCode": "400077",
    "clinicName": "Ghatkopar East Homeopathy Clinic",
    "clinicAddress": "17, Main Road, Ghatkopar East, Mumbai 400077",
    "specialties": [
      "Pediatric Homeopathy",
      "Skin & Dermatology support"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 19,
    "consultationFeeInr": 499,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Kavya Gokhale, BHMS, practices homeopathy in Ghatkopar East, Mumbai, with 19 years of clinical experience. Focus areas include pediatric homeopathy, skin & dermatology support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_018",
    "slug": "dr-kunal-tendulkar-018",
    "title": "Dr.",
    "fullName": "Dr. Kunal Tendulkar",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Mulund West",
    "postalCode": "400080",
    "clinicName": "Mulund West Homeopathy Clinic",
    "clinicAddress": "18, Main Road, Mulund West, Mumbai 400080",
    "specialties": [
      "Women's Health",
      "Digestive Health"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 20,
    "consultationFeeInr": 549,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Kunal Tendulkar, BHMS, practices homeopathy in Mulund West, Mumbai, with 20 years of clinical experience. Focus areas include women's health, digestive health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_019",
    "slug": "dr-leela-kulkarni-019",
    "title": "Dr.",
    "fullName": "Dr. Leela Kulkarni",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Worli",
    "postalCode": "400018",
    "clinicName": "Worli Homeopathy Clinic",
    "clinicAddress": "19, Main Road, Worli, Mumbai 400018",
    "specialties": [
      "Men's Health",
      "Respiratory Health"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 21,
    "consultationFeeInr": 599,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Leela Kulkarni, BHMS, practices homeopathy in Worli, Mumbai, with 21 years of clinical experience. Focus areas include men's health, respiratory health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_020",
    "slug": "dr-manish-agarwal-020",
    "title": "Dr.",
    "fullName": "Dr. Manish Agarwal",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Lower Parel",
    "postalCode": "400013",
    "clinicName": "Lower Parel Homeopathy Clinic",
    "clinicAddress": "20, Main Road, Lower Parel, Mumbai 400013",
    "specialties": [
      "Skin & Dermatology support",
      "Joint & Musculoskeletal"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 22,
    "consultationFeeInr": 649,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Manish Agarwal, BHMS, practices homeopathy in Lower Parel, Mumbai, with 22 years of clinical experience. Focus areas include skin & dermatology support, joint & musculoskeletal. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_021",
    "slug": "dr-meera-pillai-021",
    "title": "Dr.",
    "fullName": "Dr. Meera Pillai",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Colaba",
    "postalCode": "400005",
    "clinicName": "Colaba Homeopathy Clinic",
    "clinicAddress": "21, Main Road, Colaba, Mumbai 400005",
    "specialties": [
      "Digestive Health",
      "Lifestyle & Wellness"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 23,
    "consultationFeeInr": 699,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Meera Pillai, BHMS, practices homeopathy in Colaba, Mumbai, with 23 years of clinical experience. Focus areas include digestive health, lifestyle & wellness. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_022",
    "slug": "dr-nikhil-pereira-022",
    "title": "Dr.",
    "fullName": "Dr. Nikhil Pereira",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Fort",
    "postalCode": "400001",
    "clinicName": "Fort Homeopathy Clinic",
    "clinicAddress": "22, Main Road, Fort, Mumbai 400001",
    "specialties": [
      "Respiratory Health",
      "Senior Care"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 24,
    "consultationFeeInr": 749,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Nikhil Pereira, BHMS, practices homeopathy in Fort, Mumbai, with 24 years of clinical experience. Focus areas include respiratory health, senior care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_023",
    "slug": "dr-neha-gaikwad-023",
    "title": "Dr.",
    "fullName": "Dr. Neha Gaikwad",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Santacruz West",
    "postalCode": "400054",
    "clinicName": "Santacruz West Homeopathy Clinic",
    "clinicAddress": "23, Main Road, Santacruz West, Mumbai 400054",
    "specialties": [
      "Joint & Musculoskeletal",
      "Allergy-related care"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 25,
    "consultationFeeInr": 799,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Neha Gaikwad, BHMS, practices homeopathy in Santacruz West, Mumbai, with 25 years of clinical experience. Focus areas include joint & musculoskeletal, allergy-related care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_024",
    "slug": "dr-omkar-kapoor-024",
    "title": "Dr.",
    "fullName": "Dr. Omkar Kapoor",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Juhu",
    "postalCode": "400049",
    "clinicName": "Juhu Homeopathy Clinic",
    "clinicAddress": "24, Main Road, Juhu, Mumbai 400049",
    "specialties": [
      "Lifestyle & Wellness",
      "Hair & Scalp"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 26,
    "consultationFeeInr": 849,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Omkar Kapoor, BHMS, practices homeopathy in Juhu, Mumbai, with 26 years of clinical experience. Focus areas include lifestyle & wellness, hair & scalp. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_025",
    "slug": "dr-pooja-mishra-025",
    "title": "Dr.",
    "fullName": "Dr. Pooja Mishra",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Versova",
    "postalCode": "400061",
    "clinicName": "Versova Homeopathy Clinic",
    "clinicAddress": "25, Main Road, Versova, Mumbai 400061",
    "specialties": [
      "Senior Care",
      "Urinary Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 27,
    "consultationFeeInr": 299,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Pooja Mishra, BHMS, practices homeopathy in Versova, Mumbai, with 27 years of clinical experience. Focus areas include senior care, urinary health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_026",
    "slug": "dr-pranav-oak-026",
    "title": "Dr.",
    "fullName": "Dr. Pranav Oak",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Kurla West",
    "postalCode": "400070",
    "clinicName": "Kurla West Homeopathy Clinic",
    "clinicAddress": "26, Main Road, Kurla West, Mumbai 400070",
    "specialties": [
      "Allergy-related care",
      "Sleep & Stress support"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 28,
    "consultationFeeInr": 349,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Pranav Oak, BHMS, practices homeopathy in Kurla West, Mumbai, with 28 years of clinical experience. Focus areas include allergy-related care, sleep & stress support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_027",
    "slug": "dr-priya-mehta-027",
    "title": "Dr.",
    "fullName": "Dr. Priya Mehta",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Sion",
    "postalCode": "400022",
    "clinicName": "Sion Homeopathy Clinic",
    "clinicAddress": "27, Main Road, Sion, Mumbai 400022",
    "specialties": [
      "Hair & Scalp",
      "Family Practice"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 29,
    "consultationFeeInr": 399,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Priya Mehta, BHMS, practices homeopathy in Sion, Mumbai, with 29 years of clinical experience. Focus areas include hair & scalp, family practice. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_028",
    "slug": "dr-rahul-reddy-028",
    "title": "Dr.",
    "fullName": "Dr. Rahul Reddy",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Matunga",
    "postalCode": "400019",
    "clinicName": "Matunga Homeopathy Clinic",
    "clinicAddress": "28, Main Road, Matunga, Mumbai 400019",
    "specialties": [
      "Urinary Health",
      "General Homeopathy"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 30,
    "consultationFeeInr": 449,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Rahul Reddy, BHMS, practices homeopathy in Matunga, Mumbai, with 30 years of clinical experience. Focus areas include urinary health, general homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_029",
    "slug": "dr-rhea-mukherjee-029",
    "title": "Dr.",
    "fullName": "Dr. Rhea Mukherjee",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Mahim",
    "postalCode": "400016",
    "clinicName": "Mahim Homeopathy Clinic",
    "clinicAddress": "29, Main Road, Mahim, Mumbai 400016",
    "specialties": [
      "Sleep & Stress support",
      "Pediatric Homeopathy"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 3,
    "consultationFeeInr": 499,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Rhea Mukherjee, BHMS, practices homeopathy in Mahim, Mumbai, with 3 years of clinical experience. Focus areas include sleep & stress support, pediatric homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_030",
    "slug": "dr-rohan-naik-030",
    "title": "Dr.",
    "fullName": "Dr. Rohan Naik",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Khar West",
    "postalCode": "400052",
    "clinicName": "Khar West Homeopathy Clinic",
    "clinicAddress": "30, Main Road, Khar West, Mumbai 400052",
    "specialties": [
      "Family Practice",
      "Women's Health"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 4,
    "consultationFeeInr": 549,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Rohan Naik, BHMS, practices homeopathy in Khar West, Mumbai, with 4 years of clinical experience. Focus areas include family practice, women's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_031",
    "slug": "dr-sana-kamble-031",
    "title": "Dr.",
    "fullName": "Dr. Sana Kamble",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Bhandup West",
    "postalCode": "400078",
    "clinicName": "Bhandup West Homeopathy Clinic",
    "clinicAddress": "31, Main Road, Bhandup West, Mumbai 400078",
    "specialties": [
      "General Homeopathy",
      "Men's Health"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 5,
    "consultationFeeInr": 599,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Sana Kamble, BHMS, practices homeopathy in Bhandup West, Mumbai, with 5 years of clinical experience. Focus areas include general homeopathy, men's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_032",
    "slug": "dr-sanjay-chavan-032",
    "title": "Dr.",
    "fullName": "Dr. Sanjay Chavan",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Vikhroli",
    "postalCode": "400079",
    "clinicName": "Vikhroli Homeopathy Clinic",
    "clinicAddress": "32, Main Road, Vikhroli, Mumbai 400079",
    "specialties": [
      "Pediatric Homeopathy",
      "Skin & Dermatology support"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 6,
    "consultationFeeInr": 649,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Sanjay Chavan, BHMS, practices homeopathy in Vikhroli, Mumbai, with 6 years of clinical experience. Focus areas include pediatric homeopathy, skin & dermatology support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_033",
    "slug": "dr-sara-chopra-033",
    "title": "Dr.",
    "fullName": "Dr. Sara Chopra",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Panvel",
    "postalCode": "410206",
    "clinicName": "Panvel Homeopathy Clinic",
    "clinicAddress": "33, Main Road, Panvel, Mumbai 410206",
    "specialties": [
      "Women's Health",
      "Digestive Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 7,
    "consultationFeeInr": 699,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Sara Chopra, BHMS, practices homeopathy in Panvel, Mumbai, with 7 years of clinical experience. Focus areas include women's health, digestive health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_034",
    "slug": "dr-shreya-apte-034",
    "title": "Dr.",
    "fullName": "Dr. Shreya Apte",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Kalyan",
    "postalCode": "421301",
    "clinicName": "Kalyan Homeopathy Clinic",
    "clinicAddress": "34, Main Road, Kalyan, Mumbai 421301",
    "specialties": [
      "Men's Health",
      "Respiratory Health"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 8,
    "consultationFeeInr": 749,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Shreya Apte, BHMS, practices homeopathy in Kalyan, Mumbai, with 8 years of clinical experience. Focus areas include men's health, respiratory health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_035",
    "slug": "dr-siddharth-phadke-035",
    "title": "Dr.",
    "fullName": "Dr. Siddharth Phadke",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Dombivli",
    "postalCode": "421201",
    "clinicName": "Dombivli Homeopathy Clinic",
    "clinicAddress": "35, Main Road, Dombivli, Mumbai 421201",
    "specialties": [
      "Skin & Dermatology support",
      "Joint & Musculoskeletal"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 9,
    "consultationFeeInr": 799,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Siddharth Phadke, BHMS, practices homeopathy in Dombivli, Mumbai, with 9 years of clinical experience. Focus areas include skin & dermatology support, joint & musculoskeletal. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_036",
    "slug": "dr-simran-desai-036",
    "title": "Dr.",
    "fullName": "Dr. Simran Desai",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Mira Road",
    "postalCode": "401107",
    "clinicName": "Mira Road Homeopathy Clinic",
    "clinicAddress": "36, Main Road, Mira Road, Mumbai 401107",
    "specialties": [
      "Digestive Health",
      "Lifestyle & Wellness"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 10,
    "consultationFeeInr": 849,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Simran Desai, BHMS, practices homeopathy in Mira Road, Mumbai, with 10 years of clinical experience. Focus areas include digestive health, lifestyle & wellness. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_037",
    "slug": "dr-sneha-gupta-037",
    "title": "Dr.",
    "fullName": "Dr. Sneha Gupta",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Bhayandar",
    "postalCode": "401101",
    "clinicName": "Bhayandar Homeopathy Clinic",
    "clinicAddress": "37, Main Road, Bhayandar, Mumbai 401101",
    "specialties": [
      "Respiratory Health",
      "Senior Care"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 11,
    "consultationFeeInr": 299,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Sneha Gupta, BHMS, practices homeopathy in Bhayandar, Mumbai, with 11 years of clinical experience. Focus areas include respiratory health, senior care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_038",
    "slug": "dr-tanvi-sen-038",
    "title": "Dr.",
    "fullName": "Dr. Tanvi Sen",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Airoli",
    "postalCode": "400708",
    "clinicName": "Airoli Homeopathy Clinic",
    "clinicAddress": "38, Main Road, Airoli, Mumbai 400708",
    "specialties": [
      "Joint & Musculoskeletal",
      "Allergy-related care"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 12,
    "consultationFeeInr": 349,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Tanvi Sen, BHMS, practices homeopathy in Airoli, Mumbai, with 12 years of clinical experience. Focus areas include joint & musculoskeletal, allergy-related care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_039",
    "slug": "dr-uday-dsouza-039",
    "title": "Dr.",
    "fullName": "Dr. Uday D'Souza",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Kharghar",
    "postalCode": "410210",
    "clinicName": "Kharghar Homeopathy Clinic",
    "clinicAddress": "39, Main Road, Kharghar, Mumbai 410210",
    "specialties": [
      "Lifestyle & Wellness",
      "Hair & Scalp"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 13,
    "consultationFeeInr": 399,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Uday D'Souza, BHMS, practices homeopathy in Kharghar, Mumbai, with 13 years of clinical experience. Focus areas include lifestyle & wellness, hair & scalp. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_040",
    "slug": "dr-varun-jadhav-040",
    "title": "Dr.",
    "fullName": "Dr. Varun Jadhav",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Belapur",
    "postalCode": "400614",
    "clinicName": "Belapur Homeopathy Clinic",
    "clinicAddress": "40, Main Road, Belapur, Mumbai 400614",
    "specialties": [
      "Senior Care",
      "Urinary Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 14,
    "consultationFeeInr": 449,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Varun Jadhav, BHMS, practices homeopathy in Belapur, Mumbai, with 14 years of clinical experience. Focus areas include senior care, urinary health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_041",
    "slug": "dr-vikram-malhotra-041",
    "title": "Dr.",
    "fullName": "Dr. Vikram Malhotra",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Sewri",
    "postalCode": "400015",
    "clinicName": "Sewri Homeopathy Clinic",
    "clinicAddress": "1, Main Road, Sewri, Mumbai 400015",
    "specialties": [
      "Allergy-related care",
      "Sleep & Stress support"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 15,
    "consultationFeeInr": 499,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Vikram Malhotra, BHMS, practices homeopathy in Sewri, Mumbai, with 15 years of clinical experience. Focus areas include allergy-related care, sleep & stress support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_042",
    "slug": "dr-yash-tiwari-042",
    "title": "Dr.",
    "fullName": "Dr. Yash Tiwari",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Parel",
    "postalCode": "400012",
    "clinicName": "Parel Homeopathy Clinic",
    "clinicAddress": "2, Main Road, Parel, Mumbai 400012",
    "specialties": [
      "Hair & Scalp",
      "Family Practice"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 16,
    "consultationFeeInr": 549,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Yash Tiwari, BHMS, practices homeopathy in Parel, Mumbai, with 16 years of clinical experience. Focus areas include hair & scalp, family practice. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_043",
    "slug": "dr-zara-limaye-043",
    "title": "Dr.",
    "fullName": "Dr. Zara Limaye",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Byculla",
    "postalCode": "400008",
    "clinicName": "Byculla Homeopathy Clinic",
    "clinicAddress": "3, Main Road, Byculla, Mumbai 400008",
    "specialties": [
      "Urinary Health",
      "General Homeopathy"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 17,
    "consultationFeeInr": 599,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Zara Limaye, BHMS, practices homeopathy in Byculla, Mumbai, with 17 years of clinical experience. Focus areas include urinary health, general homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_044",
    "slug": "dr-amit-patel-044",
    "title": "Dr.",
    "fullName": "Dr. Amit Patel",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Mazgaon",
    "postalCode": "400010",
    "clinicName": "Mazgaon Homeopathy Clinic",
    "clinicAddress": "4, Main Road, Mazgaon, Mumbai 400010",
    "specialties": [
      "Sleep & Stress support",
      "Pediatric Homeopathy"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 18,
    "consultationFeeInr": 649,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Amit Patel, BHMS, practices homeopathy in Mazgaon, Mumbai, with 18 years of clinical experience. Focus areas include sleep & stress support, pediatric homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_045",
    "slug": "dr-anjali-iyer-045",
    "title": "Dr.",
    "fullName": "Dr. Anjali Iyer",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Walkeshwar",
    "postalCode": "400006",
    "clinicName": "Walkeshwar Homeopathy Clinic",
    "clinicAddress": "5, Main Road, Walkeshwar, Mumbai 400006",
    "specialties": [
      "Family Practice",
      "Women's Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 19,
    "consultationFeeInr": 699,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Anjali Iyer, BHMS, practices homeopathy in Walkeshwar, Mumbai, with 19 years of clinical experience. Focus areas include family practice, women's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_046",
    "slug": "dr-ashwin-chatterjee-046",
    "title": "Dr.",
    "fullName": "Dr. Ashwin Chatterjee",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Pedder Road",
    "postalCode": "400026",
    "clinicName": "Pedder Road Homeopathy Clinic",
    "clinicAddress": "6, Main Road, Pedder Road, Mumbai 400026",
    "specialties": [
      "General Homeopathy",
      "Men's Health"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 20,
    "consultationFeeInr": 749,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Ashwin Chatterjee, BHMS, practices homeopathy in Pedder Road, Mumbai, with 20 years of clinical experience. Focus areas include general homeopathy, men's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_047",
    "slug": "dr-bhakti-rao-047",
    "title": "Dr.",
    "fullName": "Dr. Bhakti Rao",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Prabhadevi",
    "postalCode": "400025",
    "clinicName": "Prabhadevi Homeopathy Clinic",
    "clinicAddress": "7, Main Road, Prabhadevi, Mumbai 400025",
    "specialties": [
      "Pediatric Homeopathy",
      "Skin & Dermatology support"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 21,
    "consultationFeeInr": 799,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Bhakti Rao, BHMS, practices homeopathy in Prabhadevi, Mumbai, with 21 years of clinical experience. Focus areas include pediatric homeopathy, skin & dermatology support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_048",
    "slug": "dr-chetan-dias-048",
    "title": "Dr.",
    "fullName": "Dr. Chetan Dias",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "King's Circle",
    "postalCode": "400019",
    "clinicName": "King's Circle Homeopathy Clinic",
    "clinicAddress": "8, Main Road, King's Circle, Mumbai 400019",
    "specialties": [
      "Women's Health",
      "Digestive Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 22,
    "consultationFeeInr": 849,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Chetan Dias, BHMS, practices homeopathy in King's Circle, Mumbai, with 22 years of clinical experience. Focus areas include women's health, digestive health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_049",
    "slug": "dr-darshan-salvi-049",
    "title": "Dr.",
    "fullName": "Dr. Darshan Salvi",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Tilak Nagar",
    "postalCode": "400089",
    "clinicName": "Tilak Nagar Homeopathy Clinic",
    "clinicAddress": "9, Main Road, Tilak Nagar, Mumbai 400089",
    "specialties": [
      "Men's Health",
      "Respiratory Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 23,
    "consultationFeeInr": 299,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Darshan Salvi, BHMS, practices homeopathy in Tilak Nagar, Mumbai, with 23 years of clinical experience. Focus areas include men's health, respiratory health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_050",
    "slug": "dr-ekta-arora-050",
    "title": "Dr.",
    "fullName": "Dr. Ekta Arora",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Govandi",
    "postalCode": "400043",
    "clinicName": "Govandi Homeopathy Clinic",
    "clinicAddress": "10, Main Road, Govandi, Mumbai 400043",
    "specialties": [
      "Skin & Dermatology support",
      "Joint & Musculoskeletal"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 24,
    "consultationFeeInr": 349,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Ekta Arora, BHMS, practices homeopathy in Govandi, Mumbai, with 24 years of clinical experience. Focus areas include skin & dermatology support, joint & musculoskeletal. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_051",
    "slug": "dr-fatima-kulkarni-051",
    "title": "Dr.",
    "fullName": "Dr. Fatima Kulkarni",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Andheri West",
    "postalCode": "400058",
    "clinicName": "Andheri West Homeopathy Clinic",
    "clinicAddress": "11, Main Road, Andheri West, Mumbai 400058",
    "specialties": [
      "Digestive Health",
      "Lifestyle & Wellness"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 25,
    "consultationFeeInr": 399,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Fatima Kulkarni, BHMS, practices homeopathy in Andheri West, Mumbai, with 25 years of clinical experience. Focus areas include digestive health, lifestyle & wellness. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_052",
    "slug": "dr-gopal-kelkar-052",
    "title": "Dr.",
    "fullName": "Dr. Gopal Kelkar",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Andheri East",
    "postalCode": "400069",
    "clinicName": "Andheri East Homeopathy Clinic",
    "clinicAddress": "12, Main Road, Andheri East, Mumbai 400069",
    "specialties": [
      "Respiratory Health",
      "Senior Care"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 26,
    "consultationFeeInr": 449,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Gopal Kelkar, BHMS, practices homeopathy in Andheri East, Mumbai, with 26 years of clinical experience. Focus areas include respiratory health, senior care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_053",
    "slug": "dr-heena-joshi-053",
    "title": "Dr.",
    "fullName": "Dr. Heena Joshi",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Bandra West",
    "postalCode": "400050",
    "clinicName": "Bandra West Homeopathy Clinic",
    "clinicAddress": "13, Main Road, Bandra West, Mumbai 400050",
    "specialties": [
      "Joint & Musculoskeletal",
      "Allergy-related care"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 27,
    "consultationFeeInr": 499,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Heena Joshi, BHMS, practices homeopathy in Bandra West, Mumbai, with 27 years of clinical experience. Focus areas include joint & musculoskeletal, allergy-related care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_054",
    "slug": "dr-imran-khan-054",
    "title": "Dr.",
    "fullName": "Dr. Imran Khan",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Bandra East",
    "postalCode": "400051",
    "clinicName": "Bandra East Homeopathy Clinic",
    "clinicAddress": "14, Main Road, Bandra East, Mumbai 400051",
    "specialties": [
      "Lifestyle & Wellness",
      "Hair & Scalp"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 28,
    "consultationFeeInr": 549,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Imran Khan, BHMS, practices homeopathy in Bandra East, Mumbai, with 28 years of clinical experience. Focus areas include lifestyle & wellness, hair & scalp. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_055",
    "slug": "dr-jyoti-bose-055",
    "title": "Dr.",
    "fullName": "Dr. Jyoti Bose",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Dadar West",
    "postalCode": "400028",
    "clinicName": "Dadar West Homeopathy Clinic",
    "clinicAddress": "15, Main Road, Dadar West, Mumbai 400028",
    "specialties": [
      "Senior Care",
      "Urinary Health"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 29,
    "consultationFeeInr": 599,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Jyoti Bose, BHMS, practices homeopathy in Dadar West, Mumbai, with 29 years of clinical experience. Focus areas include senior care, urinary health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_056",
    "slug": "dr-kiran-fernandes-056",
    "title": "Dr.",
    "fullName": "Dr. Kiran Fernandes",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Dadar East",
    "postalCode": "400014",
    "clinicName": "Dadar East Homeopathy Clinic",
    "clinicAddress": "16, Main Road, Dadar East, Mumbai 400014",
    "specialties": [
      "Allergy-related care",
      "Sleep & Stress support"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 30,
    "consultationFeeInr": 649,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Kiran Fernandes, BHMS, practices homeopathy in Dadar East, Mumbai, with 30 years of clinical experience. Focus areas include allergy-related care, sleep & stress support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_057",
    "slug": "dr-lakshmi-sawant-057",
    "title": "Dr.",
    "fullName": "Dr. Lakshmi Sawant",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Powai",
    "postalCode": "400076",
    "clinicName": "Powai Homeopathy Clinic",
    "clinicAddress": "17, Main Road, Powai, Mumbai 400076",
    "specialties": [
      "Hair & Scalp",
      "Family Practice"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 3,
    "consultationFeeInr": 699,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Lakshmi Sawant, BHMS, practices homeopathy in Powai, Mumbai, with 3 years of clinical experience. Focus areas include hair & scalp, family practice. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_058",
    "slug": "dr-mohit-thakur-058",
    "title": "Dr.",
    "fullName": "Dr. Mohit Thakur",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Goregaon West",
    "postalCode": "400104",
    "clinicName": "Goregaon West Homeopathy Clinic",
    "clinicAddress": "18, Main Road, Goregaon West, Mumbai 400104",
    "specialties": [
      "Urinary Health",
      "General Homeopathy"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 4,
    "consultationFeeInr": 749,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Mohit Thakur, BHMS, practices homeopathy in Goregaon West, Mumbai, with 4 years of clinical experience. Focus areas include urinary health, general homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_059",
    "slug": "dr-nandini-verma-059",
    "title": "Dr.",
    "fullName": "Dr. Nandini Verma",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Goregaon East",
    "postalCode": "400063",
    "clinicName": "Goregaon East Homeopathy Clinic",
    "clinicAddress": "19, Main Road, Goregaon East, Mumbai 400063",
    "specialties": [
      "Sleep & Stress support",
      "Pediatric Homeopathy"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 5,
    "consultationFeeInr": 799,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Nandini Verma, BHMS, practices homeopathy in Goregaon East, Mumbai, with 5 years of clinical experience. Focus areas include sleep & stress support, pediatric homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_060",
    "slug": "dr-otima-bhave-060",
    "title": "Dr.",
    "fullName": "Dr. Otima Bhave",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Malad West",
    "postalCode": "400064",
    "clinicName": "Malad West Homeopathy Clinic",
    "clinicAddress": "20, Main Road, Malad West, Mumbai 400064",
    "specialties": [
      "Family Practice",
      "Women's Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 6,
    "consultationFeeInr": 849,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Otima Bhave, BHMS, practices homeopathy in Malad West, Mumbai, with 6 years of clinical experience. Focus areas include family practice, women's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_061",
    "slug": "dr-parth-sharma-061",
    "title": "Dr.",
    "fullName": "Dr. Parth Sharma",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Kandivali West",
    "postalCode": "400067",
    "clinicName": "Kandivali West Homeopathy Clinic",
    "clinicAddress": "21, Main Road, Kandivali West, Mumbai 400067",
    "specialties": [
      "General Homeopathy",
      "Men's Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 7,
    "consultationFeeInr": 299,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Parth Sharma, BHMS, practices homeopathy in Kandivali West, Mumbai, with 7 years of clinical experience. Focus areas include general homeopathy, men's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_062",
    "slug": "dr-qasim-nair-062",
    "title": "Dr.",
    "fullName": "Dr. Qasim Nair",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Borivali West",
    "postalCode": "400092",
    "clinicName": "Borivali West Homeopathy Clinic",
    "clinicAddress": "22, Main Road, Borivali West, Mumbai 400092",
    "specialties": [
      "Pediatric Homeopathy",
      "Skin & Dermatology support"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 8,
    "consultationFeeInr": 349,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Qasim Nair, BHMS, practices homeopathy in Borivali West, Mumbai, with 8 years of clinical experience. Focus areas include pediatric homeopathy, skin & dermatology support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_063",
    "slug": "dr-rajesh-banerjee-063",
    "title": "Dr.",
    "fullName": "Dr. Rajesh Banerjee",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Thane West",
    "postalCode": "400601",
    "clinicName": "Thane West Homeopathy Clinic",
    "clinicAddress": "23, Main Road, Thane West, Mumbai 400601",
    "specialties": [
      "Women's Health",
      "Digestive Health"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 9,
    "consultationFeeInr": 399,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Rajesh Banerjee, BHMS, practices homeopathy in Thane West, Mumbai, with 9 years of clinical experience. Focus areas include women's health, digestive health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_064",
    "slug": "dr-ritu-menon-064",
    "title": "Dr.",
    "fullName": "Dr. Ritu Menon",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Navi Mumbai \u2014 Vashi",
    "postalCode": "400703",
    "clinicName": "Navi Mumbai \u2014 Vashi Homeopathy Clinic",
    "clinicAddress": "24, Main Road, Navi Mumbai \u2014 Vashi, Mumbai 400703",
    "specialties": [
      "Men's Health",
      "Respiratory Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 10,
    "consultationFeeInr": 449,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Ritu Menon, BHMS, practices homeopathy in Navi Mumbai \u2014 Vashi, Mumbai, with 10 years of clinical experience. Focus areas include men's health, respiratory health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_065",
    "slug": "dr-suresh-rodrigues-065",
    "title": "Dr.",
    "fullName": "Dr. Suresh Rodrigues",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Navi Mumbai \u2014 Nerul",
    "postalCode": "400706",
    "clinicName": "Navi Mumbai \u2014 Nerul Homeopathy Clinic",
    "clinicAddress": "25, Main Road, Navi Mumbai \u2014 Nerul, Mumbai 400706",
    "specialties": [
      "Skin & Dermatology support",
      "Joint & Musculoskeletal"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 11,
    "consultationFeeInr": 499,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Suresh Rodrigues, BHMS, practices homeopathy in Navi Mumbai \u2014 Nerul, Mumbai, with 11 years of clinical experience. Focus areas include skin & dermatology support, joint & musculoskeletal. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_066",
    "slug": "dr-trisha-more-066",
    "title": "Dr.",
    "fullName": "Dr. Trisha More",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Chembur",
    "postalCode": "400071",
    "clinicName": "Chembur Homeopathy Clinic",
    "clinicAddress": "26, Main Road, Chembur, Mumbai 400071",
    "specialties": [
      "Digestive Health",
      "Lifestyle & Wellness"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 12,
    "consultationFeeInr": 549,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Trisha More, BHMS, practices homeopathy in Chembur, Mumbai, with 12 years of clinical experience. Focus areas include digestive health, lifestyle & wellness. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_067",
    "slug": "dr-urvashi-bhatia-067",
    "title": "Dr.",
    "fullName": "Dr. Urvashi Bhatia",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Ghatkopar East",
    "postalCode": "400077",
    "clinicName": "Ghatkopar East Homeopathy Clinic",
    "clinicAddress": "27, Main Road, Ghatkopar East, Mumbai 400077",
    "specialties": [
      "Respiratory Health",
      "Senior Care"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 13,
    "consultationFeeInr": 599,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Urvashi Bhatia, BHMS, practices homeopathy in Ghatkopar East, Mumbai, with 13 years of clinical experience. Focus areas include respiratory health, senior care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_068",
    "slug": "dr-vivek-pandey-068",
    "title": "Dr.",
    "fullName": "Dr. Vivek Pandey",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Mulund West",
    "postalCode": "400080",
    "clinicName": "Mulund West Homeopathy Clinic",
    "clinicAddress": "28, Main Road, Mulund West, Mumbai 400080",
    "specialties": [
      "Joint & Musculoskeletal",
      "Allergy-related care"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 14,
    "consultationFeeInr": 649,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Vivek Pandey, BHMS, practices homeopathy in Mulund West, Mumbai, with 14 years of clinical experience. Focus areas include joint & musculoskeletal, allergy-related care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_069",
    "slug": "dr-wasim-date-069",
    "title": "Dr.",
    "fullName": "Dr. Wasim Date",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Worli",
    "postalCode": "400018",
    "clinicName": "Worli Homeopathy Clinic",
    "clinicAddress": "29, Main Road, Worli, Mumbai 400018",
    "specialties": [
      "Lifestyle & Wellness",
      "Hair & Scalp"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 15,
    "consultationFeeInr": 699,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Wasim Date, BHMS, practices homeopathy in Worli, Mumbai, with 15 years of clinical experience. Focus areas include lifestyle & wellness, hair & scalp. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_070",
    "slug": "dr-yamini-shah-070",
    "title": "Dr.",
    "fullName": "Dr. Yamini Shah",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Lower Parel",
    "postalCode": "400013",
    "clinicName": "Lower Parel Homeopathy Clinic",
    "clinicAddress": "30, Main Road, Lower Parel, Mumbai 400013",
    "specialties": [
      "Senior Care",
      "Urinary Health"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 16,
    "consultationFeeInr": 749,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Yamini Shah, BHMS, practices homeopathy in Lower Parel, Mumbai, with 16 years of clinical experience. Focus areas include senior care, urinary health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_071",
    "slug": "dr-ankit-singh-071",
    "title": "Dr.",
    "fullName": "Dr. Ankit Singh",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Colaba",
    "postalCode": "400005",
    "clinicName": "Colaba Homeopathy Clinic",
    "clinicAddress": "31, Main Road, Colaba, Mumbai 400005",
    "specialties": [
      "Allergy-related care",
      "Sleep & Stress support"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 17,
    "consultationFeeInr": 799,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Ankit Singh, BHMS, practices homeopathy in Colaba, Mumbai, with 17 years of clinical experience. Focus areas include allergy-related care, sleep & stress support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_072",
    "slug": "dr-bhavesh-das-072",
    "title": "Dr.",
    "fullName": "Dr. Bhavesh Das",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Fort",
    "postalCode": "400001",
    "clinicName": "Fort Homeopathy Clinic",
    "clinicAddress": "32, Main Road, Fort, Mumbai 400001",
    "specialties": [
      "Hair & Scalp",
      "Family Practice"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 18,
    "consultationFeeInr": 849,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Bhavesh Das, BHMS, practices homeopathy in Fort, Mumbai, with 18 years of clinical experience. Focus areas include hair & scalp, family practice. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_073",
    "slug": "dr-chitra-shetty-073",
    "title": "Dr.",
    "fullName": "Dr. Chitra Shetty",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Santacruz West",
    "postalCode": "400054",
    "clinicName": "Santacruz West Homeopathy Clinic",
    "clinicAddress": "33, Main Road, Santacruz West, Mumbai 400054",
    "specialties": [
      "Urinary Health",
      "General Homeopathy"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 19,
    "consultationFeeInr": 299,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Chitra Shetty, BHMS, practices homeopathy in Santacruz West, Mumbai, with 19 years of clinical experience. Focus areas include urinary health, general homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_074",
    "slug": "dr-dhruv-patil-074",
    "title": "Dr.",
    "fullName": "Dr. Dhruv Patil",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Juhu",
    "postalCode": "400049",
    "clinicName": "Juhu Homeopathy Clinic",
    "clinicAddress": "34, Main Road, Juhu, Mumbai 400049",
    "specialties": [
      "Sleep & Stress support",
      "Pediatric Homeopathy"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 20,
    "consultationFeeInr": 349,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Dhruv Patil, BHMS, practices homeopathy in Juhu, Mumbai, with 20 years of clinical experience. Focus areas include sleep & stress support, pediatric homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_075",
    "slug": "dr-eva-rane-075",
    "title": "Dr.",
    "fullName": "Dr. Eva Rane",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Versova",
    "postalCode": "400061",
    "clinicName": "Versova Homeopathy Clinic",
    "clinicAddress": "35, Main Road, Versova, Mumbai 400061",
    "specialties": [
      "Family Practice",
      "Women's Health"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 21,
    "consultationFeeInr": 399,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Eva Rane, BHMS, practices homeopathy in Versova, Mumbai, with 21 years of clinical experience. Focus areas include family practice, women's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_076",
    "slug": "dr-falguni-saxena-076",
    "title": "Dr.",
    "fullName": "Dr. Falguni Saxena",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Kurla West",
    "postalCode": "400070",
    "clinicName": "Kurla West Homeopathy Clinic",
    "clinicAddress": "36, Main Road, Kurla West, Mumbai 400070",
    "specialties": [
      "General Homeopathy",
      "Men's Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 22,
    "consultationFeeInr": 449,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Falguni Saxena, BHMS, practices homeopathy in Kurla West, Mumbai, with 22 years of clinical experience. Focus areas include general homeopathy, men's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_077",
    "slug": "dr-girish-gokhale-077",
    "title": "Dr.",
    "fullName": "Dr. Girish Gokhale",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Sion",
    "postalCode": "400022",
    "clinicName": "Sion Homeopathy Clinic",
    "clinicAddress": "37, Main Road, Sion, Mumbai 400022",
    "specialties": [
      "Pediatric Homeopathy",
      "Skin & Dermatology support"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 23,
    "consultationFeeInr": 499,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Girish Gokhale, BHMS, practices homeopathy in Sion, Mumbai, with 23 years of clinical experience. Focus areas include pediatric homeopathy, skin & dermatology support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_078",
    "slug": "dr-hitesh-tendulkar-078",
    "title": "Dr.",
    "fullName": "Dr. Hitesh Tendulkar",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Matunga",
    "postalCode": "400019",
    "clinicName": "Matunga Homeopathy Clinic",
    "clinicAddress": "38, Main Road, Matunga, Mumbai 400019",
    "specialties": [
      "Women's Health",
      "Digestive Health"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 24,
    "consultationFeeInr": 549,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Hitesh Tendulkar, BHMS, practices homeopathy in Matunga, Mumbai, with 24 years of clinical experience. Focus areas include women's health, digestive health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_079",
    "slug": "dr-indira-kulkarni-079",
    "title": "Dr.",
    "fullName": "Dr. Indira Kulkarni",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Mahim",
    "postalCode": "400016",
    "clinicName": "Mahim Homeopathy Clinic",
    "clinicAddress": "39, Main Road, Mahim, Mumbai 400016",
    "specialties": [
      "Men's Health",
      "Respiratory Health"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 25,
    "consultationFeeInr": 599,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Indira Kulkarni, BHMS, practices homeopathy in Mahim, Mumbai, with 25 years of clinical experience. Focus areas include men's health, respiratory health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_080",
    "slug": "dr-jaya-agarwal-080",
    "title": "Dr.",
    "fullName": "Dr. Jaya Agarwal",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Khar West",
    "postalCode": "400052",
    "clinicName": "Khar West Homeopathy Clinic",
    "clinicAddress": "40, Main Road, Khar West, Mumbai 400052",
    "specialties": [
      "Skin & Dermatology support",
      "Joint & Musculoskeletal"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 26,
    "consultationFeeInr": 649,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Jaya Agarwal, BHMS, practices homeopathy in Khar West, Mumbai, with 26 years of clinical experience. Focus areas include skin & dermatology support, joint & musculoskeletal. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_081",
    "slug": "dr-karthik-pillai-081",
    "title": "Dr.",
    "fullName": "Dr. Karthik Pillai",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Bhandup West",
    "postalCode": "400078",
    "clinicName": "Bhandup West Homeopathy Clinic",
    "clinicAddress": "1, Main Road, Bhandup West, Mumbai 400078",
    "specialties": [
      "Digestive Health",
      "Lifestyle & Wellness"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 27,
    "consultationFeeInr": 699,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Karthik Pillai, BHMS, practices homeopathy in Bhandup West, Mumbai, with 27 years of clinical experience. Focus areas include digestive health, lifestyle & wellness. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_082",
    "slug": "dr-lata-pereira-082",
    "title": "Dr.",
    "fullName": "Dr. Lata Pereira",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Vikhroli",
    "postalCode": "400079",
    "clinicName": "Vikhroli Homeopathy Clinic",
    "clinicAddress": "2, Main Road, Vikhroli, Mumbai 400079",
    "specialties": [
      "Respiratory Health",
      "Senior Care"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 28,
    "consultationFeeInr": 749,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Lata Pereira, BHMS, practices homeopathy in Vikhroli, Mumbai, with 28 years of clinical experience. Focus areas include respiratory health, senior care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_083",
    "slug": "dr-madhuri-gaikwad-083",
    "title": "Dr.",
    "fullName": "Dr. Madhuri Gaikwad",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Panvel",
    "postalCode": "410206",
    "clinicName": "Panvel Homeopathy Clinic",
    "clinicAddress": "3, Main Road, Panvel, Mumbai 410206",
    "specialties": [
      "Joint & Musculoskeletal",
      "Allergy-related care"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 29,
    "consultationFeeInr": 799,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Madhuri Gaikwad, BHMS, practices homeopathy in Panvel, Mumbai, with 29 years of clinical experience. Focus areas include joint & musculoskeletal, allergy-related care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_084",
    "slug": "dr-naveen-kapoor-084",
    "title": "Dr.",
    "fullName": "Dr. Naveen Kapoor",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Kalyan",
    "postalCode": "421301",
    "clinicName": "Kalyan Homeopathy Clinic",
    "clinicAddress": "4, Main Road, Kalyan, Mumbai 421301",
    "specialties": [
      "Lifestyle & Wellness",
      "Hair & Scalp"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 30,
    "consultationFeeInr": 849,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Naveen Kapoor, BHMS, practices homeopathy in Kalyan, Mumbai, with 30 years of clinical experience. Focus areas include lifestyle & wellness, hair & scalp. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_085",
    "slug": "dr-olive-mishra-085",
    "title": "Dr.",
    "fullName": "Dr. Olive Mishra",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Dombivli",
    "postalCode": "421201",
    "clinicName": "Dombivli Homeopathy Clinic",
    "clinicAddress": "5, Main Road, Dombivli, Mumbai 421201",
    "specialties": [
      "Senior Care",
      "Urinary Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 3,
    "consultationFeeInr": 299,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Olive Mishra, BHMS, practices homeopathy in Dombivli, Mumbai, with 3 years of clinical experience. Focus areas include senior care, urinary health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_086",
    "slug": "dr-pallavi-oak-086",
    "title": "Dr.",
    "fullName": "Dr. Pallavi Oak",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Mira Road",
    "postalCode": "401107",
    "clinicName": "Mira Road Homeopathy Clinic",
    "clinicAddress": "6, Main Road, Mira Road, Mumbai 401107",
    "specialties": [
      "Allergy-related care",
      "Sleep & Stress support"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 4,
    "consultationFeeInr": 349,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Pallavi Oak, BHMS, practices homeopathy in Mira Road, Mumbai, with 4 years of clinical experience. Focus areas include allergy-related care, sleep & stress support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_087",
    "slug": "dr-quincy-mehta-087",
    "title": "Dr.",
    "fullName": "Dr. Quincy Mehta",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Bhayandar",
    "postalCode": "401101",
    "clinicName": "Bhayandar Homeopathy Clinic",
    "clinicAddress": "7, Main Road, Bhayandar, Mumbai 401101",
    "specialties": [
      "Hair & Scalp",
      "Family Practice"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 5,
    "consultationFeeInr": 399,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Quincy Mehta, BHMS, practices homeopathy in Bhayandar, Mumbai, with 5 years of clinical experience. Focus areas include hair & scalp, family practice. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_088",
    "slug": "dr-ramesh-reddy-088",
    "title": "Dr.",
    "fullName": "Dr. Ramesh Reddy",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Airoli",
    "postalCode": "400708",
    "clinicName": "Airoli Homeopathy Clinic",
    "clinicAddress": "8, Main Road, Airoli, Mumbai 400708",
    "specialties": [
      "Urinary Health",
      "General Homeopathy"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 6,
    "consultationFeeInr": 449,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Ramesh Reddy, BHMS, practices homeopathy in Airoli, Mumbai, with 6 years of clinical experience. Focus areas include urinary health, general homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_089",
    "slug": "dr-seema-mukherjee-089",
    "title": "Dr.",
    "fullName": "Dr. Seema Mukherjee",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Kharghar",
    "postalCode": "410210",
    "clinicName": "Kharghar Homeopathy Clinic",
    "clinicAddress": "9, Main Road, Kharghar, Mumbai 410210",
    "specialties": [
      "Sleep & Stress support",
      "Pediatric Homeopathy"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 7,
    "consultationFeeInr": 499,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Seema Mukherjee, BHMS, practices homeopathy in Kharghar, Mumbai, with 7 years of clinical experience. Focus areas include sleep & stress support, pediatric homeopathy. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_090",
    "slug": "dr-tejas-naik-090",
    "title": "Dr.",
    "fullName": "Dr. Tejas Naik",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Belapur",
    "postalCode": "400614",
    "clinicName": "Belapur Homeopathy Clinic",
    "clinicAddress": "10, Main Road, Belapur, Mumbai 400614",
    "specialties": [
      "Family Practice",
      "Women's Health"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 8,
    "consultationFeeInr": 549,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Tejas Naik, BHMS, practices homeopathy in Belapur, Mumbai, with 8 years of clinical experience. Focus areas include family practice, women's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_091",
    "slug": "dr-umesh-kamble-091",
    "title": "Dr.",
    "fullName": "Dr. Umesh Kamble",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Sewri",
    "postalCode": "400015",
    "clinicName": "Sewri Homeopathy Clinic",
    "clinicAddress": "11, Main Road, Sewri, Mumbai 400015",
    "specialties": [
      "General Homeopathy",
      "Men's Health"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 9,
    "consultationFeeInr": 599,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Umesh Kamble, BHMS, practices homeopathy in Sewri, Mumbai, with 9 years of clinical experience. Focus areas include general homeopathy, men's health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_092",
    "slug": "dr-veena-chavan-092",
    "title": "Dr.",
    "fullName": "Dr. Veena Chavan",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Parel",
    "postalCode": "400012",
    "clinicName": "Parel Homeopathy Clinic",
    "clinicAddress": "12, Main Road, Parel, Mumbai 400012",
    "specialties": [
      "Pediatric Homeopathy",
      "Skin & Dermatology support"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 10,
    "consultationFeeInr": 649,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Veena Chavan, BHMS, practices homeopathy in Parel, Mumbai, with 10 years of clinical experience. Focus areas include pediatric homeopathy, skin & dermatology support. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_093",
    "slug": "dr-waheeda-chopra-093",
    "title": "Dr.",
    "fullName": "Dr. Waheeda Chopra",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Byculla",
    "postalCode": "400008",
    "clinicName": "Byculla Homeopathy Clinic",
    "clinicAddress": "13, Main Road, Byculla, Mumbai 400008",
    "specialties": [
      "Women's Health",
      "Digestive Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "gu"
    ],
    "yearsExperience": 11,
    "consultationFeeInr": 699,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Waheeda Chopra, BHMS, practices homeopathy in Byculla, Mumbai, with 11 years of clinical experience. Focus areas include women's health, digestive health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_094",
    "slug": "dr-yogesh-apte-094",
    "title": "Dr.",
    "fullName": "Dr. Yogesh Apte",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Mazgaon",
    "postalCode": "400010",
    "clinicName": "Mazgaon Homeopathy Clinic",
    "clinicAddress": "14, Main Road, Mazgaon, Mumbai 400010",
    "specialties": [
      "Men's Health",
      "Respiratory Health"
    ],
    "languages": [
      "English"
    ],
    "languageCodes": [
      "en"
    ],
    "yearsExperience": 12,
    "consultationFeeInr": 749,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Yogesh Apte, BHMS, practices homeopathy in Mazgaon, Mumbai, with 12 years of clinical experience. Focus areas include men's health, respiratory health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_095",
    "slug": "dr-zubin-phadke-095",
    "title": "Dr.",
    "fullName": "Dr. Zubin Phadke",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Walkeshwar",
    "postalCode": "400006",
    "clinicName": "Walkeshwar Homeopathy Clinic",
    "clinicAddress": "15, Main Road, Walkeshwar, Mumbai 400006",
    "specialties": [
      "Skin & Dermatology support",
      "Joint & Musculoskeletal"
    ],
    "languages": [
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "hi",
      "mr"
    ],
    "yearsExperience": 13,
    "consultationFeeInr": 799,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Zubin Phadke, BHMS, practices homeopathy in Walkeshwar, Mumbai, with 13 years of clinical experience. Focus areas include skin & dermatology support, joint & musculoskeletal. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_096",
    "slug": "dr-alok-desai-096",
    "title": "Dr.",
    "fullName": "Dr. Alok Desai",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Pedder Road",
    "postalCode": "400026",
    "clinicName": "Pedder Road Homeopathy Clinic",
    "clinicAddress": "16, Main Road, Pedder Road, Mumbai 400026",
    "specialties": [
      "Digestive Health",
      "Lifestyle & Wellness"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Kannada"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr",
      "kn"
    ],
    "yearsExperience": 14,
    "consultationFeeInr": 849,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Alok Desai, BHMS, practices homeopathy in Pedder Road, Mumbai, with 14 years of clinical experience. Focus areas include digestive health, lifestyle & wellness. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_097",
    "slug": "dr-bindu-gupta-097",
    "title": "Dr.",
    "fullName": "Dr. Bindu Gupta",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Prabhadevi",
    "postalCode": "400025",
    "clinicName": "Prabhadevi Homeopathy Clinic",
    "clinicAddress": "17, Main Road, Prabhadevi, Mumbai 400025",
    "specialties": [
      "Respiratory Health",
      "Senior Care"
    ],
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "hi",
      "mr"
    ],
    "yearsExperience": 15,
    "consultationFeeInr": 299,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Bindu Gupta, BHMS, practices homeopathy in Prabhadevi, Mumbai, with 15 years of clinical experience. Focus areas include respiratory health, senior care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_098",
    "slug": "dr-cyrus-sen-098",
    "title": "Dr.",
    "fullName": "Dr. Cyrus Sen",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "King's Circle",
    "postalCode": "400019",
    "clinicName": "King's Circle Homeopathy Clinic",
    "clinicAddress": "18, Main Road, King's Circle, Mumbai 400019",
    "specialties": [
      "Joint & Musculoskeletal",
      "Allergy-related care"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "languageCodes": [
      "en",
      "hi"
    ],
    "yearsExperience": 16,
    "consultationFeeInr": 349,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Cyrus Sen, BHMS, practices homeopathy in King's Circle, Mumbai, with 16 years of clinical experience. Focus areas include joint & musculoskeletal, allergy-related care. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_099",
    "slug": "dr-disha-dsouza-099",
    "title": "Dr.",
    "fullName": "Dr. Disha D'Souza",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Tilak Nagar",
    "postalCode": "400089",
    "clinicName": "Tilak Nagar Homeopathy Clinic",
    "clinicAddress": "19, Main Road, Tilak Nagar, Mumbai 400089",
    "specialties": [
      "Lifestyle & Wellness",
      "Hair & Scalp"
    ],
    "languages": [
      "English",
      "Marathi"
    ],
    "languageCodes": [
      "en",
      "mr"
    ],
    "yearsExperience": 17,
    "consultationFeeInr": 399,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Disha D'Souza, BHMS, practices homeopathy in Tilak Nagar, Mumbai, with 17 years of clinical experience. Focus areas include lifestyle & wellness, hair & scalp. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  },
  {
    "id": "doc_100",
    "slug": "dr-eshan-jadhav-100",
    "title": "Dr.",
    "fullName": "Dr. Eshan Jadhav",
    "credentials": "BHMS",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Govandi",
    "postalCode": "400043",
    "clinicName": "Govandi Homeopathy Clinic",
    "clinicAddress": "20, Main Road, Govandi, Mumbai 400043",
    "specialties": [
      "Senior Care",
      "Urinary Health"
    ],
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "languageCodes": [
      "en",
      "hi",
      "gu"
    ],
    "yearsExperience": 18,
    "consultationFeeInr": 449,
    "formats": [
      "Online video",
      "Clinic visit"
    ],
    "bio": "Dr. Eshan Jadhav, BHMS, practices homeopathy in Govandi, Mumbai, with 18 years of clinical experience. Focus areas include senior care, urinary health. Consultations are available online and at the clinic. Educational guidance only \u2014 not a substitute for emergency or specialist hospital care.",
    "availabilityNote": "Next slots open this week \u00b7 confirm at booking",
    "responseTime": "Usually responds within a few hours",
    "listed": true,
    "verificationStatus": "LISTED",
    "acceptingPatients": true
  }
];

type DoctorOverride = {
  consultationFeeInr?: number;
  acceptingPatients?: boolean;
  availabilityNote?: string;
  verificationStatus?: "LISTED" | "VERIFIED";
  listed?: boolean;
};

function loadDoctorOverrides(): Record<string, DoctorOverride> {
  try {
    const path = join(process.cwd(), "../../data/cms/doctor-overrides.json");
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, DoctorOverride>;
  } catch {
    try {
      const path = join(process.cwd(), "data/cms/doctor-overrides.json");
      return JSON.parse(readFileSync(path, "utf8")) as Record<string, DoctorOverride>;
    } catch {
      return {};
    }
  }
}

function applyDoctorOverrides(list: DoctorProfile[]): DoctorProfile[] {
  const map = loadDoctorOverrides();
  return list
    .map((d) => {
      const o = map[d.id];
      if (!o) return d;
      return {
        ...d,
        consultationFeeInr: o.consultationFeeInr ?? d.consultationFeeInr,
        acceptingPatients: o.acceptingPatients ?? d.acceptingPatients,
        availabilityNote: o.availabilityNote ?? d.availabilityNote,
        verificationStatus: o.verificationStatus ?? d.verificationStatus,
        listed: o.listed ?? d.listed,
      };
    })
    .filter((d) => d.listed !== false);
}

export const DOCTORS = applyDoctorOverrides(DOCTOR_SEED);

export function getDoctorBySlug(slug: string): DoctorProfile | undefined {
  return DOCTORS.find((d) => d.slug === slug);
}

export function listDoctorsByCity(city: string): DoctorProfile[] {
  return DOCTORS.filter((d) => d.city.toLowerCase() === city.toLowerCase());
}

export function listAllDoctorSlugs(): string[] {
  return DOCTORS.map((d) => d.slug);
}

export const MUMBAI_LOCALITIES = [
  "Airoli",
  "Andheri East",
  "Andheri West",
  "Bandra East",
  "Bandra West",
  "Belapur",
  "Bhandup West",
  "Bhayandar",
  "Borivali West",
  "Byculla",
  "Chembur",
  "Colaba",
  "Dadar East",
  "Dadar West",
  "Dombivli",
  "Fort",
  "Ghatkopar East",
  "Goregaon East",
  "Goregaon West",
  "Govandi",
  "Juhu",
  "Kalyan",
  "Kandivali West",
  "Khar West",
  "Kharghar",
  "King's Circle",
  "Kurla West",
  "Lower Parel",
  "Mahim",
  "Malad West",
  "Matunga",
  "Mazgaon",
  "Mira Road",
  "Mulund West",
  "Navi Mumbai \u2014 Nerul",
  "Navi Mumbai \u2014 Vashi",
  "Panvel",
  "Parel",
  "Pedder Road",
  "Powai",
  "Prabhadevi",
  "Santacruz West",
  "Sewri",
  "Sion",
  "Thane West",
  "Tilak Nagar",
  "Versova",
  "Vikhroli",
  "Walkeshwar",
  "Worli"
];
