#!/usr/bin/env python3
"""Generate KliqPrint brand documents as classic .doc (Word RTF)."""

from pathlib import Path

OUT = Path(__file__).resolve().parent / "KliqPrint_Brand_Documents.doc"
ARTIFACT = Path("/opt/cursor/artifacts/KliqPrint_Brand_Documents.doc")


def esc(text: str) -> str:
    replacements = {
        "\\": "\\\\",
        "{": "\\{",
        "}": "\\}",
        "\n": "\\par ",
        "•": "\\u8226?",
        "–": "\\u8211?",
        "—": "\\u8212?",
        "·": "\\u183?",
        "’": "\\u8217?",
        "‘": "\\u8216?",
        "“": "\\u8220?",
        "”": "\\u8221?",
    }
    for src, dst in replacements.items():
        text = text.replace(src, dst)
    return text



def title(t: str) -> str:
    return rf"{{\pard\qc\sa240\b\fs44 {esc(t)}\par}}"


def h1(t: str) -> str:
    return rf"{{\pard\sb400\sa160\b\fs32 {esc(t)}\par}}"


def h2(t: str) -> str:
    return rf"{{\pard\sb240\sa80\b\fs26 {esc(t)}\par}}"


def p(t: str) -> str:
    return rf"{{\pard\sa120\fs22 {esc(t)}\par}}"


def bullets(items: list[str]) -> str:
    parts = []
    for item in items:
        parts.append(rf"{{\pard\li360\sa40\fs22 \u8226? {esc(item)}\par}}")
    return "".join(parts)


def page_break() -> str:
    return r"{\page}"


def build() -> str:
    sections: list[str] = []

    sections += [
        title("KliqPrint"),
        p("Click · Design · Print · Deliver"),
        p("Brand Documents Pack"),
        p(
            "This document contains About Us, Contact Us, Privacy Policy, Terms of Use, "
            "Frequently Asked Questions (FAQs), Return & Refund Policy, and Sitemap."
        ),
        p(
            "Replace placeholders such as [Your Contact Number], [Your Email Address], "
            "[Your Office / Factory Address], [Your Working Hours], [3/7], and [DD/MM/YYYY] "
            "before publishing."
        ),
        page_break(),
    ]

    # About
    sections += [
        h1("About Us"),
        p(
            "KliqPrint is a professional printing, signage, branding and display solutions company "
            "committed to helping businesses create a strong and impactful visual presence. We provide "
            "high-quality customized printing solutions for businesses, institutions, retailers, event "
            "organizers, advertising agencies and individuals."
        ),
        p(
            "With a focus on quality, customization and reliable service, we combine modern printing "
            "technology with experienced production and finishing to deliver products that meet diverse "
            "branding, promotional and display requirements."
        ),
        p(
            "Our product range includes custom flags, advertising flags, banners, display stands, "
            "signs & decals, table covers & displays, asset tags, marketing materials and accessories. "
            "From a single customized requirement to bulk commercial orders, our team works closely "
            "with customers from design and artwork preparation through production and final delivery."
        ),
        h2("Why Choose KliqPrint?"),
        bullets(
            [
                "Customized Printing Solutions tailored to your branding and application",
                "Modern Printing Technology for sharp graphics and vibrant colours",
                "Wide Product Range for indoor, outdoor, retail, corporate and event use",
                "Quality Materials & Finishing for a professional appearance",
                "Bulk & Business Orders supported with scalable production",
                "Design & Artwork Assistance to help turn ideas into print-ready products",
                "Reliable Service & Delivery with a focus on customer satisfaction",
            ]
        ),
        p(
            "At KliqPrint, our goal is simple: Click. Design. Print. Deliver. We make customized "
            "printing convenient by bringing design, production and finishing together under one roof."
        ),
        p(
            "Whether you need branding for your business, promotional displays for an event, custom "
            "flags, signage or everyday marketing materials, KliqPrint is your partner for professional "
            "print and display solutions."
        ),
        page_break(),
    ]

    # Contact
    sections += [
        h1("Contact Us"),
        p(
            "We'd love to hear from you! Whether you need a custom printing quotation, product "
            "information, bulk order pricing, artwork assistance or help choosing the right printing "
            "solution, the KliqPrint team is ready to assist you."
        ),
        h2("Get in Touch"),
        p("KliqPrint – Click • Design • Print • Deliver"),
        bullets(
            [
                "Phone / WhatsApp: [Your Contact Number]",
                "Email: [Your Email Address]",
                "Address: [Your Office / Factory Address]",
                "Business Hours: [Monday–Saturday, Your Working Hours]",
            ]
        ),
        h2("Custom & Bulk Order Enquiries"),
        p(
            "Looking for custom flags, banners, signage, display stands, table covers, marketing "
            "materials or other customized printing products? Share your required product, size, "
            "quantity, artwork and delivery location, and our team will provide the appropriate "
            "solution and quotation."
        ),
        h2("Send Us an Enquiry"),
        p(
            "Have a question or project in mind? Contact us today and our team will get back to you "
            "as soon as possible."
        ),
        p("KliqPrint — Your Partner for Custom Printing, Signage & Display Solutions."),
        page_break(),
    ]

    # Privacy
    sections += [
        h1("Privacy Policy"),
        p(
            "At KliqPrint, we respect your privacy and are committed to protecting the personal "
            "information you share with us. This Privacy Policy explains how we collect, use, store "
            "and protect information when you visit our website, contact us, request a quotation or "
            "purchase our products and services."
        ),
        h2("Information We Collect"),
        p(
            "We may collect information such as your name, company name, phone number, email address, "
            "billing and delivery address, order details, enquiry information and artwork or files "
            "submitted for customized printing."
        ),
        p(
            "We may also collect certain technical information when you use our website, including "
            "browser type, device information, IP address, pages visited and cookies or similar "
            "technologies."
        ),
        h2("How We Use Your Information"),
        p("We may use your information to:"),
        bullets(
            [
                "Process and fulfil orders",
                "Prepare quotations and respond to enquiries",
                "Provide customized printing and design services",
                "Communicate order, payment, production and delivery updates",
                "Provide customer support",
                "Improve our website, products and services",
                "Maintain business and transaction records",
                "Prevent fraud, misuse and security incidents",
                "Send promotional communications where permitted by applicable law",
            ]
        ),
        h2("Payment Information"),
        p(
            "Payments may be processed through third-party payment gateways or financial institutions. "
            "KliqPrint does not intentionally store complete card details, UPI PINs, banking passwords "
            "or other sensitive payment authentication information on its own systems."
        ),
        h2("Cookies"),
        p(
            "Our website may use cookies and similar technologies to improve functionality, understand "
            "website usage and enhance your browsing experience. You can control or disable cookies "
            "through your browser settings, although certain website features may not function properly "
            "as a result."
        ),
        h2("Sharing of Information"),
        p(
            "We do not sell or rent your personal information. Information may be shared with trusted "
            "service providers where reasonably necessary to operate our business, including payment "
            "processors, logistics and courier partners, website or technology providers and other "
            "service providers assisting with order fulfilment."
        ),
        p(
            "We may also disclose information where required by applicable law, regulation, legal "
            "process or government authority."
        ),
        h2("Data Security"),
        p(
            "We take reasonable administrative and technical measures to protect personal information "
            "against unauthorized access, misuse, alteration, disclosure or loss. However, no "
            "internet-based transmission or electronic storage system can be guaranteed to be "
            "completely secure."
        ),
        h2("Data Retention"),
        p(
            "We retain personal information only for as long as reasonably necessary for the purposes "
            "for which it was collected, including order fulfilment, customer support, accounting, "
            "legal and regulatory requirements."
        ),
        h2("Your Rights"),
        p(
            "Subject to applicable law, you may contact us to request access to, correction of or "
            "deletion of your personal information, or to raise questions regarding how your "
            "information is handled."
        ),
        h2("Third-Party Links"),
        p(
            "Our website may contain links to third-party websites or services. KliqPrint is not "
            "responsible for the privacy practices, security or content of those third-party websites."
        ),
        h2("Changes to This Privacy Policy"),
        p(
            "We may update this Privacy Policy periodically to reflect changes in our business "
            "practices, website functionality or applicable legal requirements. The updated version "
            "will be posted on this page with a revised effective date."
        ),
        h2("Contact Us"),
        p("For questions or concerns regarding this Privacy Policy or your personal information, please contact:"),
        p("KliqPrint"),
        bullets(
            [
                "Email: [Your Email Address]",
                "Phone / WhatsApp: [Your Contact Number]",
                "Address: [Your Registered Business Address]",
            ]
        ),
        p("Effective Date: [DD/MM/YYYY]"),
        page_break(),
    ]

    # Terms
    sections += [
        h1("Terms of Use"),
        p(
            "Welcome to KliqPrint. These Terms of Use govern your access to and use of our website, "
            "products and services. By accessing our website, submitting an enquiry or placing an "
            "order, you agree to these terms."
        ),
        h2("Products & Services"),
        p(
            "KliqPrint provides custom printing, flags, banners, signage, display stands, table covers, "
            "marketing materials, accessories and related printing and branding solutions. Product "
            "specifications, colours, sizes, materials and availability may vary depending on the "
            "selected product and customization requirements."
        ),
        h2("Orders & Customization"),
        p(
            "Customers are responsible for providing accurate information regarding size, quantity, "
            "design, text, colours, artwork and other specifications before confirming an order."
        ),
        p(
            "For customized products, production may begin after approval of the artwork, "
            "specifications and applicable payment. Once customization or production has started, "
            "changes or cancellations may not always be possible."
        ),
        h2("Artwork & Customer-Supplied Content"),
        p(
            "Customers must ensure that they have the necessary rights and permissions to use any "
            "logos, photographs, trademarks, designs, text or other artwork submitted to KliqPrint."
        ),
        p(
            "By submitting artwork, the customer authorizes KliqPrint to use the supplied material "
            "solely as reasonably necessary to produce the requested products or services."
        ),
        h2("Colours & Product Appearance"),
        p(
            "We make reasonable efforts to reproduce colours and designs accurately. However, slight "
            "variations may occur due to differences in screens, printing processes, materials, inks, "
            "lighting and production batches. Such reasonable variations may not be considered "
            "manufacturing defects."
        ),
        h2("Pricing & Payment"),
        p(
            "Prices may vary depending on product specifications, quantity, customization, taxes, "
            "shipping and other requirements. The applicable price will be communicated or displayed "
            "before order confirmation."
        ),
        p("Orders may require full or partial payment before production or dispatch."),
        h2("Shipping & Delivery"),
        p(
            "Estimated production and delivery timelines are provided in good faith. Delivery times "
            "may vary due to order complexity, courier operations, location, weather, public holidays "
            "or circumstances beyond our reasonable control."
        ),
        p("Customers are responsible for providing a complete and accurate delivery address and contact information."),
        h2("Returns, Cancellations & Refunds"),
        p("Returns, cancellations and refunds are subject to our applicable Return, Refund and Cancellation Policy."),
        p(
            "Customized, personalized or made-to-order products may not be eligible for return or "
            "cancellation once production has started, except where the product received is defective, "
            "damaged, incorrect or otherwise eligible under applicable law."
        ),
        h2("Intellectual Property"),
        p(
            "Unless otherwise stated, website content belonging to KliqPrint, including its branding, "
            "graphics, product photographs, designs, text and other original materials, is protected "
            "by applicable intellectual property laws."
        ),
        p("Such content may not be copied, reproduced, distributed or commercially used without authorization."),
        h2("Acceptable Use"),
        p(
            "You agree not to misuse our website, attempt unauthorized access, interfere with website "
            "functionality, submit fraudulent information or use our services for unlawful purposes."
        ),
        h2("Limitation of Liability"),
        p(
            "To the extent permitted by applicable law, KliqPrint will not be responsible for "
            "indirect or consequential losses arising from the use of our website, products or services."
        ),
        p(
            "Nothing in these Terms is intended to exclude or restrict any rights or liabilities that "
            "cannot legally be excluded under applicable law."
        ),
        h2("Third-Party Services"),
        p(
            "Our website or services may use or link to third-party providers, including payment "
            "gateways, courier companies and other service providers. Their respective terms and "
            "policies may apply when you use their services."
        ),
        h2("Changes to These Terms"),
        p(
            "KliqPrint may update these Terms of Use periodically. Any revised terms will become "
            "effective when published on our website unless otherwise stated."
        ),
        h2("Governing Law"),
        p(
            "These Terms will be governed by the laws of India. Any disputes will be subject to the "
            "jurisdiction of the competent courts applicable to KliqPrint's registered place of "
            "business, subject to applicable consumer protection laws."
        ),
        h2("Contact Us"),
        p("For questions regarding these Terms of Use, please contact:"),
        p("KliqPrint"),
        bullets(
            [
                "Email: [Your Email Address]",
                "Phone / WhatsApp: [Your Contact Number]",
                "Address: [Your Registered Business Address]",
            ]
        ),
        p("Effective Date: [DD/MM/YYYY]"),
        page_break(),
    ]

    faqs = [
        (
            "1. What products does KliqPrint offer?",
            "KliqPrint provides a wide range of custom printing, signage and display solutions, including custom flags, advertising flags, banners, display stands, table covers, signs & decals, asset tags, marketing materials and accessories.",
        ),
        (
            "2. Do you provide customized printing?",
            "Yes. We specialize in customized printing. You can provide your logo, artwork, text, colours, dimensions and other requirements, and our team will help prepare your product for production.",
        ),
        (
            "3. Can I order products in custom sizes?",
            "Yes. Custom sizes are available for many products. Availability depends on the product, material and printing requirements.",
        ),
        (
            "4. Do you accept bulk and corporate orders?",
            "Yes. We accept bulk, corporate, institutional, event and reseller orders. Contact us with the product, size, quantity and delivery location to request a quotation.",
        ),
        (
            "5. How can I request a quotation?",
            "Send us your requirements through our website, email, phone or WhatsApp. For a faster quotation, please provide the product name, dimensions, quantity, artwork/design requirements and delivery location.",
        ),
        (
            "6. What artwork files do you accept?",
            "Depending on the product, we may accept commonly used formats such as PDF, AI, EPS, CDR, PSD, PNG and high-resolution JPG/JPEG. Vector or high-resolution artwork is generally recommended for the best printing results.",
        ),
        (
            "7. Can KliqPrint help with artwork or design?",
            "Yes. Our team can assist with basic artwork preparation, sizing and print-ready file setup, depending on the requirements of your order. Additional design charges may apply for extensive design work.",
        ),
        (
            "8. Will the printed colours exactly match my screen?",
            "We make reasonable efforts to achieve accurate colour reproduction. However, slight colour variations can occur because of screen settings, printing methods, inks, materials and production batches.",
        ),
        (
            "9. How long does production take?",
            "Production time depends on the product, quantity, customization and current workload. An estimated production and dispatch timeline can be provided when your order is confirmed.",
        ),
        (
            "10. Do you deliver across India?",
            "Yes, we can ship orders to locations across India, subject to courier serviceability. Delivery charges and timelines may vary according to the destination, order size and shipping method.",
        ),
        (
            "11. Do you accept international orders?",
            "International order availability depends on the product, quantity and destination. Contact our team with your requirements and destination country for assistance with export orders.",
        ),
        (
            "12. Can I cancel or modify a customized order?",
            "Please contact us as soon as possible. Changes or cancellations may be possible before production begins. Once a customized or personalized product has entered production, cancellation or modification may not be possible.",
        ),
        (
            "13. What if I receive a damaged or incorrect product?",
            "Please contact KliqPrint promptly with your order details and clear photographs or videos of the product and packaging. Our team will review the issue in accordance with the applicable return, replacement and refund policy.",
        ),
        (
            "14. How can I contact KliqPrint?",
            "For product enquiries, quotations, custom orders or customer support, contact us at: Phone / WhatsApp: [Your Contact Number]; Email: [Your Email Address]; Address: [Your Business Address].",
        ),
    ]

    sections += [
        h1("Frequently Asked Questions (FAQs)"),
        p(
            "Find answers to some of the most common questions about KliqPrint products, custom "
            "printing, ordering, artwork, payments and delivery."
        ),
    ]
    for q, a in faqs:
        sections.append(h2(q))
        sections.append(p(a))
    sections += [
        p("KliqPrint — Click • Design • Print • Deliver"),
        page_break(),
    ]

    # Return
    sections += [
        h1("Return & Refund Policy"),
        p(
            "At KliqPrint, we are committed to delivering quality customized printing and display "
            "products. As many of our products are custom-made, personalized or produced according to "
            "specific customer requirements, returns and refunds are subject to the conditions below."
        ),
        h2("Return Eligibility"),
        p("A return or replacement may be considered if:"),
        bullets(
            [
                "The product received is damaged or defective.",
                "You received an incorrect product, size or quantity compared with the confirmed order.",
                "There is a significant printing or manufacturing defect.",
                "The product is materially different from the specifications approved before production.",
            ]
        ),
        p("Please contact us within [3/7] days of delivery to report an eligible issue."),
        h2("Customized & Personalized Products"),
        p(
            "Products manufactured according to customer-specific designs, logos, artwork, sizes, "
            "colours, text or other customization requirements are generally non-returnable and "
            "non-refundable unless they are damaged, defective or materially different from the "
            "approved order."
        ),
        h2("How to Request a Return or Replacement"),
        p("To report an issue, please contact our customer support team and provide:"),
        bullets(
            [
                "Your order number/invoice number",
                "A description of the issue",
                "Clear photographs of the product",
                "Photographs of the packaging, where relevant",
                "An unboxing video, if available",
            ]
        ),
        p(
            "Our team will review the information and advise you regarding the appropriate "
            "replacement, return or refund, where applicable."
        ),
        h2("Non-Returnable Situations"),
        p(
            "Returns may not be accepted for products that have been used, installed, altered, washed "
            "or damaged after delivery, products ordered with incorrect specifications supplied by the "
            "customer, minor colour variations caused by screens/materials/printing processes, or "
            "customized products produced according to approved artwork and specifications."
        ),
        h2("Order Cancellation"),
        p(
            "If you need to cancel an order, please contact us immediately. Orders may be cancelled "
            "before production begins, subject to the status of the order."
        ),
        p("Once printing, customization or production has started, cancellation may not be possible."),
        h2("Refunds"),
        p(
            "If a refund is approved, it will generally be processed to the original payment method "
            "or another mutually agreed method. Processing time may vary depending on the payment "
            "provider or financial institution."
        ),
        p(
            "Any applicable shipping, design, customization or production charges may be deducted "
            "where permitted and appropriate."
        ),
        h2("Replacement"),
        p(
            "Where an eligible manufacturing defect, damage or incorrect product is confirmed, "
            "KliqPrint may offer a replacement instead of a refund where appropriate."
        ),
        h2("Shipping Damage"),
        p(
            "If your package arrives visibly damaged, please take clear photographs of the outer "
            "packaging and product before disposing of the packaging. Contact us promptly so we can "
            "review the issue."
        ),
        h2("Contact Us"),
        p("For return, replacement, cancellation or refund assistance, please contact:"),
        p("KliqPrint"),
        bullets(
            [
                "Phone / WhatsApp: [Your Contact Number]",
                "Email: [Your Email Address]",
                "Address: [Your Registered Business Address]",
            ]
        ),
        p("Effective Date: [DD/MM/YYYY]"),
        page_break(),
    ]

    # Sitemap
    sections += [
        h1("Sitemap"),
        p("Quickly explore KliqPrint and find the products, services and information you need."),
        h2("Main Pages"),
        bullets(["Home", "About Us", "Contact Us", "FAQs"]),
        h2("Products"),
        bullets(
            [
                "Flags",
                "Custom Flags",
                "Advertising Flags",
                "Banners",
                "Display Stands",
                "Signs & Decals",
                "Table Covers & Displays",
                "Asset Tags",
                "Marketing Materials",
                "Accessories",
            ]
        ),
        h2("Custom Printing Services"),
        bullets(
            [
                "Custom Design & Printing",
                "Business Branding Solutions",
                "Event & Promotional Printing",
                "Corporate & Bulk Orders",
                "Custom Size Printing",
                "Artwork & Design Assistance",
            ]
        ),
        h2("Customer Support"),
        bullets(
            [
                "Contact Us",
                "Request a Quote",
                "FAQs",
                "Order & Delivery Information",
                "Return & Refund Policy",
            ]
        ),
        h2("Legal & Policies"),
        bullets(["Privacy Policy", "Terms of Use", "Return & Refund Policy"]),
        h2("Connect With KliqPrint"),
        bullets(["Phone / WhatsApp", "Email", "Social Media"]),
        p("KliqPrint — Click • Design • Print • Deliver"),
    ]

    body = "".join(sections)
    return (
        r"{\rtf1\ansi\deff0"
        r"{\fonttbl{\f0 Calibri;}}"
        r"\f0\fs22 "
        f"{body}"
        r"}"
    )


def main() -> None:
    content = build()
    OUT.write_text(content, encoding="utf-8")
    ARTIFACT.write_text(content, encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Wrote {ARTIFACT}")


if __name__ == "__main__":
    main()
