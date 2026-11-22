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
                'answer' => <<<'TXT'
Guide: A simple guide to shopping with Homeopathy Pharma.

1. Explore Products
Browse Shop by Category or Brands from the top menu, or use Search to find a medicine by name or concern. Open the product that matches what you need.

2. View Product Details
On the product page, check the brand, pack size, price, and description so you know exactly what you are ordering before you continue.

3. Add to Cart
Select the quantity you need, then click Add to Cart. You can keep shopping and add more products to the same cart in one purchase.

4. Review Your Cart
Open Cart from the header. Verify each item, quantity, and the order total. Update or remove anything that looks wrong before checkout.

5. Enter Delivery Details
Click Proceed to checkout. Enter your full name, phone number, email (optional), and complete shipping address — address lines, city, state, and postal code. Add order notes if you have special delivery instructions.

6. Complete Payment
Submit the checkout form and pay using the available online payment methods. After a successful payment, open Account / Track Order anytime to follow your order status.
TXT,
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

            // Pricing & Payments
            [
                'category' => 'Pricing & Payments',
                'question' => 'Are the prices displayed on the website inclusive of applicable taxes?',
                'answer' => null,
                'sort_order' => 26,
            ],
            [
                'category' => 'Pricing & Payments',
                'question' => 'Will I receive a GST invoice with my order?',
                'answer' => null,
                'sort_order' => 27,
            ],
            [
                'category' => 'Pricing & Payments',
                'question' => 'What should I do if my payment is deducted but my order is not confirmed?',
                'answer' => <<<'TXT'
Guide: If payment was deducted but your order is unclear.

1. Note your payment details
Keep the payment reference, UPI/bank transaction ID, amount, date/time, and any order number shown on screen or in your bank SMS/email.

2. Check your Account orders
If you used or have an account, open Account → Your orders (also linked as Track Order) and look for a matching order and payment status.

3. Check Cart and checkout messages
Open Cart again. If checkout failed, you may still see items there or an error message from the payment step.

4. Contact support with proof
Call / WhatsApp us or use Contact Us. Share your name, phone, payment reference, amount, and approximate time so we can verify the payment and confirm or restore the order.
TXT,
                'sort_order' => 28,
            ],
            [
                'category' => 'Pricing & Payments',
                'question' => 'Can I apply discount coupons or promotional offers to my purchase?',
                'answer' => null,
                'sort_order' => 29,
            ],
            [
                'category' => 'Pricing & Payments',
                'question' => 'Are there any additional charges apart from the displayed product price?',
                'answer' => 'The product page shows the product price (and any sale price when a discount is applied on that item). Shipping and tax, if applicable, are calculated and shown at checkout before you pay — review the checkout total carefully before completing payment.',
                'sort_order' => 30,
            ],

            // Product Selection & Availability
            [
                'category' => 'Product Selection & Availability',
                'question' => 'Can I compare different brands of the same product?',
                'answer' => <<<'TXT'
Guide: How to compare brands on Homeopathy Pharma.

1. Search or browse by name
Use Search for the medicine name, or open Shop by Category for the relevant category.

2. Open Brands
From Brands in the menu, open each brand you want to compare and browse its catalogue.

3. Compare on product pages
Open each product page and check brand, pack size, potency/form (where listed), price, and description side by side before adding to cart.

4. Choose and add to cart
Add the option that suits you. You can add more than one brand to the same cart if you want to order both.
TXT,
                'sort_order' => 31,
            ],
            [
                'category' => 'Product Selection & Availability',
                'question' => 'Can I purchase products from multiple brands in a single order?',
                'answer' => 'Yes. Add products from any brands to the same cart and check out once. Your order will include every item together.',
                'sort_order' => 32,
            ],
            [
                'category' => 'Product Selection & Availability',
                'question' => 'Will I be informed if a product is discontinued?',
                'answer' => null,
                'sort_order' => 33,
            ],
            [
                'category' => 'Product Selection & Availability',
                'question' => 'Are bulk orders accepted on Homeopathy Pharma?',
                'answer' => null,
                'sort_order' => 34,
            ],
            [
                'category' => 'Product Selection & Availability',
                'question' => 'Can I save products to my wishlist for future purchases?',
                'answer' => null,
                'sort_order' => 35,
            ],

            // Orders & Account
            [
                'category' => 'Orders & Account',
                'question' => 'Can I view my previous order history?',
                'answer' => <<<'TXT'
Guide: How to view your order history.

1. Open Account
Click Account in the header (or Track Order under More).

2. Sign in
Log in with your registered account details.

3. Open Your orders
Go to Your orders to see past orders with order number, total, and payment status.

4. Open an order
Click an order number for item details and fulfilment status.
TXT,
                'sort_order' => 36,
            ],
            [
                'category' => 'Orders & Account',
                'question' => 'Can I reorder products from my previous purchases?',
                'answer' => <<<'TXT'
Guide: How to reorder items you bought before.

1. Find the earlier order
Sign in, open Your orders, and open the order that has the products you want again.

2. Note the product names
Write down or remember the product names (and pack sizes) from that order list.

3. Search and open each product
Use Search or Shop to open each product page again.

4. Add to Cart and checkout
Add the quantities you need, review Cart, then Proceed to checkout as usual.
TXT,
                'sort_order' => 37,
            ],
            [
                'category' => 'Orders & Account',
                'question' => 'Can I place an order as a guest without registering?',
                'answer' => <<<'TXT'
Guide: Ordering without creating an account first.

1. Shop as usual
Browse products and Add to Cart — you do not need to register to build a cart.

2. Go to checkout
Open Cart and click Proceed to checkout.

3. Enter your details
Fill in your name, phone, email (optional), and shipping address on the checkout form.

4. Complete payment
Pay online to place the order. Creating an Account later helps you track orders more easily under Your orders.
TXT,
                'sort_order' => 38,
            ],
            [
                'category' => 'Orders & Account',
                'question' => 'Can I download my order invoice from my account?',
                'answer' => null,
                'sort_order' => 39,
            ],
            [
                'category' => 'Orders & Account',
                'question' => 'Can I place orders for family members using one account?',
                'answer' => <<<'TXT'
Guide: Ordering for family from one account.

1. Sign in (optional but helpful)
Use your Account so all family orders stay in one order history.

2. Add the medicines needed
Add products for your family member to the cart as usual.

3. Enter their delivery details at checkout
On checkout, put the family member’s full name and the address where the order should be delivered. Use your phone if you will receive delivery updates.

4. Add a note if helpful
Use Order notes to mention it is for a family member or any delivery preference, then complete payment.
TXT,
                'sort_order' => 40,
            ],

            // Delivery & Convenience
            [
                'category' => 'Delivery & Convenience',
                'question' => 'Will products from the same order arrive in one package?',
                'answer' => null,
                'sort_order' => 41,
            ],
            [
                'category' => 'Delivery & Convenience',
                'question' => 'Do you provide discreet packaging for medicine orders?',
                'answer' => null,
                'sort_order' => 42,
            ],
            [
                'category' => 'Delivery & Convenience',
                'question' => 'Can I request a delivery to a different person as a gift?',
                'answer' => <<<'TXT'
Guide: Sending an order to someone else.

1. Add products to Cart
Choose the medicines and quantities you want to gift.

2. Proceed to checkout
Open Cart and continue to checkout.

3. Enter the recipient’s details
Use the recipient’s name and the shipping address where the gift should arrive. Use a phone number that can receive delivery updates.

4. Mention it in Order notes
In Order notes, you can write that it is a gift or any special delivery instruction, then complete payment.
TXT,
                'sort_order' => 43,
            ],
            [
                'category' => 'Delivery & Convenience',
                'question' => 'Do you accept orders from customers outside India?',
                'answer' => 'Online checkout is set up for delivery within India. If you are ordering from outside India, please Call / WhatsApp or Contact Us before ordering so we can confirm whether we can help.',
                'sort_order' => 44,
            ],
            [
                'category' => 'Delivery & Convenience',
                'question' => 'Are there any restrictions on the quantity of medicines I can purchase?',
                'answer' => 'Online, each product can be added up to the available stock, with a per-item cart limit of 99. If the quantity you need is higher or stock is limited, contact us and we will guide you.',
                'sort_order' => 45,
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
