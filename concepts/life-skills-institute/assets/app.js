// Site settings: change these before going live.
const SITE = {
  name: "Pragati Institute of Life Skills",
  email: "hello@example.com",
  whatsapp: "910000000000", // country code + number, digits only
};

// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

// Contact links from settings
document.querySelectorAll("[data-email]").forEach((el) => {
  el.href = `mailto:${SITE.email}`;
  el.textContent = SITE.email;
});
document.querySelectorAll("[data-whatsapp]").forEach((el) => {
  el.href = `https://wa.me/${SITE.whatsapp}`;
});

// Catalogue filters (cards are plain HTML; this only shows and hides them)
const filterForm = document.querySelector("[data-filters]");
if (filterForm) {
  const cards = [...document.querySelectorAll("[data-card]")];
  const count = document.querySelector("[data-count]");
  const empty = document.querySelector("[data-empty]");

  const apply = () => {
    const data = new FormData(filterForm);
    const q = String(data.get("q") || "").trim().toLowerCase();
    let shown = 0;
    for (const card of cards) {
      let ok = !q || card.textContent.toLowerCase().includes(q);
      for (const [key, value] of data.entries()) {
        if (key === "q" || !value) continue;
        if (card.dataset[key] !== value) ok = false;
      }
      card.hidden = !ok;
      if (ok) shown++;
    }
    if (count) count.textContent = `Showing ${shown} of ${cards.length}`;
    if (empty) empty.hidden = shown !== 0;
  };

  filterForm.addEventListener("input", apply);
  filterForm.addEventListener("reset", () => setTimeout(apply));
  apply();
}

// Pre-select the topic when arriving from a "Start" or "Book" button (contact.html?topic=...)
const topicSelect = document.querySelector("[data-topic]");
const topicParam = new URLSearchParams(location.search).get("topic");
if (topicSelect && topicParam) {
  let option = [...topicSelect.options].find((o) => o.value === topicParam);
  if (!option) {
    option = new Option(topicParam, topicParam);
    topicSelect.prepend(option);
  }
  option.selected = true;
}

// Enquiry form: no server needed. It opens WhatsApp or email with the message filled in.
const enquiry = document.querySelector("[data-enquiry]");
if (enquiry) {
  enquiry.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!enquiry.reportValidity()) return;
    const d = new FormData(enquiry);
    const lines = [
      `Name: ${d.get("name")}`,
      `Phone: ${d.get("phone")}`,
      `Email: ${d.get("email")}`,
      `I am: ${d.get("role")}`,
      `Interested in: ${d.get("topic")}`,
      "",
      String(d.get("message")),
    ].join("\n");
    const channel = d.get("channel");
    const url =
      channel === "email"
        ? `mailto:${SITE.email}?subject=${encodeURIComponent(`Enquiry: ${d.get("topic")}`)}&body=${encodeURIComponent(lines)}`
        : `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener");
    const status = enquiry.querySelector(".form-status");
    if (status) status.textContent = "Your message is ready to send in the window that just opened.";
  });
}
