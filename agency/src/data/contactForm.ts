export type ContactCms = {
  enabled: boolean;
  title: string;
  headline: string;
  lead: string;
  notifyEmail: string;
  successTitle: string;
  successMessage: string;
  submitLabel: string;
  whatsappFallback: boolean;
  fields: {
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    businessLabel: string;
    businessPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
  };
  seo?: { title?: string; description?: string; keywords?: string[] };
};

export const fallbackContact: ContactCms = {
  enabled: true,
  title: "Get Free Proposal",
  headline: "Let's grow your business",
  lead: "Tell us about your goals. We will reply with a clear plan in plain English - what to fix first, what it may cost, and what results to expect.",
  notifyEmail: "info@displayavenue.com",
  successTitle: "Thanks - we got your message",
  successMessage:
    "Our team will reply within 24 hours on weekdays. You can also WhatsApp us anytime.",
  submitLabel: "Get Free Proposal",
  whatsappFallback: true,
  fields: {
    nameLabel: "Your name",
    namePlaceholder: "Full name",
    phoneLabel: "Phone / WhatsApp",
    phonePlaceholder: "10-digit mobile",
    emailLabel: "Email (optional)",
    emailPlaceholder: "you@business.com",
    businessLabel: "Business type",
    businessPlaceholder: "Clinic, salon, shop, SaaS…",
    messageLabel: "What do you need help with?",
    messagePlaceholder: "Tell us about your project or goals",
  },
  seo: {
    title: "Get Free Proposal | Contact DisplayAvenue Mumbai",
    description:
      "Book a free consultation or request a custom proposal. Tell us your city and goal — DisplayAvenue replies with a clear next step. WhatsApp 9222 122333.",
    keywords: [
      "contact DisplayAvenue",
      "free digital marketing consultation Mumbai",
      "WhatsApp 9222122333",
    ],
  },
};
