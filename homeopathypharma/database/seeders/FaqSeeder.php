<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        Faq::query()->delete();

        $now = now();
        $rows = [
            // Orders & Shopping
            [
                'category' => 'Orders & Shopping',
                'question' => 'How can I place an order on Homeopathy Pharma?',
                'answer' => "1. Go to Shop or Brands and open the product you want.\n2. Click Add to Cart (add more products if you like).\n3. Open Cart from the header and review your items.\n4. Click Proceed to checkout and enter your name, phone, email, and shipping address.\n5. Complete payment to place your order.\n6. Track it anytime under Account / Track Order.",
                'sort_order' => 1,
            ],
            [
                'category' => 'Orders & Shopping',
                'question' => 'Can I order multiple products in one purchase?',
                'answer' => 'Yes. Add as many products as you like to your cart and check out once. Your order will list every item in that purchase.',
                'sort_order' => 2,
            ],
            [
                'category' => 'Orders & Shopping',
                'question' => 'Can I modify or cancel my order after placing it?',
                'answer' => null,
                'sort_order' => 3,
            ],
            [
                'category' => 'Orders & Shopping',
                'question' => 'How can I track my order?',
                'answer' => 'Use Track Order under More (or open your Account) to view your orders and their status after you sign in.',
                'sort_order' => 4,
            ],
            [
                'category' => 'Orders & Shopping',
                'question' => 'What should I do if I receive a damaged or incorrect product?',
                'answer' => null,
                'sort_order' => 5,
            ],

            // Payments & Delivery
            [
                'category' => 'Payments & Delivery',
                'question' => 'What payment methods are accepted?',
                'answer' => 'Online checkout uses secure digital payment at the payment step. If online payment is unavailable for any reason, call or WhatsApp us and we will help you complete the order.',
                'sort_order' => 6,
            ],
            [
                'category' => 'Payments & Delivery',
                'question' => 'Is Cash on Delivery available?',
                'answer' => null,
                'sort_order' => 7,
            ],
            [
                'category' => 'Payments & Delivery',
                'question' => 'How long does delivery usually take?',
                'answer' => null,
                'sort_order' => 8,
            ],
            [
                'category' => 'Payments & Delivery',
                'question' => 'Do you deliver across India?',
                'answer' => null,
                'sort_order' => 9,
            ],
            [
                'category' => 'Payments & Delivery',
                'question' => 'Are there any additional delivery charges?',
                'answer' => null,
                'sort_order' => 10,
            ],

            // Medicines & Products
            [
                'category' => 'Medicines & Products',
                'question' => 'Are all the products sold on Homeopathy Pharma genuine?',
                'answer' => 'Yes. We list medicines from recognised homeopathic brands on our catalogue. Product pages show the brand and pack details so you can verify what you are buying.',
                'sort_order' => 11,
            ],
            [
                'category' => 'Medicines & Products',
                'question' => 'How can I check the expiry date of a product?',
                'answer' => 'Check the manufacturer’s label on the pack for the expiry or “use before” date after delivery. Do not use a medicine past that date, or if the seal or label is damaged.',
                'sort_order' => 12,
            ],
            [
                'category' => 'Medicines & Products',
                'question' => 'Do the medicines come in their original packaging?',
                'answer' => null,
                'sort_order' => 13,
            ],
            [
                'category' => 'Medicines & Products',
                'question' => 'How should I store the medicines after delivery?',
                'answer' => 'Keep medicines in their original labelled containers, tightly closed, in a cool, dry place away from direct sunlight, heat, moisture, and strong-smelling substances such as perfumes or camphor.',
                'sort_order' => 14,
            ],
            [
                'category' => 'Medicines & Products',
                'question' => 'Do I need a prescription to purchase homeopathic medicines?',
                'answer' => 'Most homeopathic medicines on our store can be purchased without uploading a prescription. For personalised treatment, we recommend consulting a qualified homeopathic doctor before starting any medicine.',
                'sort_order' => 15,
            ],

            // Consultation
            [
                'category' => 'Consultation',
                'question' => 'How can I book an online consultation?',
                'answer' => 'Go to Consult a Doctor, open a doctor’s profile, and submit the consultation request form. You will receive a confirmation with your request reference number.',
                'sort_order' => 16,
            ],
            [
                'category' => 'Consultation',
                'question' => 'Can I choose my preferred doctor?',
                'answer' => 'Yes. Browse the doctors list, open the doctor you prefer, and send a consultation request for that doctor.',
                'sort_order' => 17,
            ],
            [
                'category' => 'Consultation',
                'question' => 'How will my online consultation take place?',
                'answer' => 'After your request is received, our team contacts you to schedule a Google Meet consultation. Meeting links are shared by the team once the slot is confirmed.',
                'sort_order' => 18,
            ],
            [
                'category' => 'Consultation',
                'question' => 'What happens after I book a consultation?',
                'answer' => 'You see a confirmation page with your reference number, doctor name, and fee. Our team then contacts you on the phone number you provided to schedule the session.',
                'sort_order' => 19,
            ],
            [
                'category' => 'Consultation',
                'question' => 'Can I reschedule or cancel my consultation?',
                'answer' => null,
                'sort_order' => 20,
            ],

            // Returns & Customer Support
            [
                'category' => 'Returns & Customer Support',
                'question' => 'What is your return and refund policy?',
                'answer' => null,
                'sort_order' => 21,
            ],
            [
                'category' => 'Returns & Customer Support',
                'question' => 'How long does a refund take?',
                'answer' => null,
                'sort_order' => 22,
            ],
            [
                'category' => 'Returns & Customer Support',
                'question' => 'What should I do if my order is delayed?',
                'answer' => 'Check your order status under Account / Track Order. If it is still delayed, contact us on Call / WhatsApp or through the Contact Us page with your order details so we can follow up.',
                'sort_order' => 23,
            ],
            [
                'category' => 'Returns & Customer Support',
                'question' => 'How can I contact customer support?',
                'answer' => 'Use Call / WhatsApp from the header, open Contact Us, or chat with us on WhatsApp. We are happy to help with orders, products, and consultations.',
                'sort_order' => 24,
            ],
            [
                'category' => 'Returns & Customer Support',
                'question' => 'How can I share feedback about my experience?',
                'answer' => null,
                'sort_order' => 25,
            ],
        ];

        foreach ($rows as $row) {
            Faq::query()->create([
                ...$row,
                'status' => 'published',
                'published_at' => $now,
            ]);
        }
    }
}
