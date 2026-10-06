import { useState } from "react";
import "./FAQAccordion.css";

export function FAQAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.question}>
            <button
              type="button"
              className="faq-item__q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{item.question}</span>
              <span className="faq-item__icon" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? <div className="faq-item__a">{item.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
