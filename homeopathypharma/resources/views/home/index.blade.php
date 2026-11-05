@extends('layouts.app')

@section('title', $settings->brandName().' — '.$settings->tagline())
@section('meta_description', $settings->tagline())

@section('content')
    @php($hero = $sections->get('hero'))
    @php($trust = $sections->get('trust'))
    @php($categories = $sections->get('categories'))
    @php($featured = $sections->get('featured_products'))
    @php($consult = $sections->get('consult'))
    @php($library = $sections->get('health_library'))

    <section class="hp-hero-banner hp-hero-banner--art" aria-label="Homeopathy Pharma">
        <img
            class="hp-hero-banner__art"
            src="{{ asset('images/home/hero-personal-doctors-v3.jpg') }}?v=20261104-doctors-v3"
            alt="Homeopathy Pharma — A More Personal Approach to Healthcare. Thoughtful consultations, quality-focused products and care centred around you."
            width="2000"
            height="751"
            decoding="async"
            fetchpriority="high"
        >
        <h1 class="hp-sr-only">A More Personal Approach to Healthcare.</h1>
        <a
            class="hp-hero-banner__hit hp-hero-banner__hit--consult"
            href="{{ $hero->payload['primary_cta_href'] ?? route('doctors.index') }}"
        >{{ $hero->payload['primary_cta_label'] ?? 'Consult a Doctor' }}</a>
        <a
            class="hp-hero-banner__hit hp-hero-banner__hit--shop"
            href="{{ $hero->payload['secondary_cta_href'] ?? route('shop.index') }}"
        >{{ $hero->payload['secondary_cta_label'] ?? 'Explore Remedies' }}</a>
    </section>

    @if ($trust)
        <section class="hp-trust-strip">
            <div class="hp-container hp-trust-strip__grid">
                @foreach (($trust->payload['items'] ?? []) as $item)
                    <div class="hp-trust-strip__item">
                        <span class="hp-trust-strip__icon" aria-hidden="true"></span>
                        <div>
                            <strong>{{ $item['title'] }}</strong>
                            <p>{{ $item['body'] }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
        </section>
    @endif

    <section class="hp-doctor-lead" id="talk-to-doctor" aria-label="Talk to a doctor">
        <div class="hp-doctor-lead__card">
            <div class="hp-doctor-lead__inner">
                <h2>Talk to a Doctor, Understand Your Health Better</h2>
                <p class="hp-doctor-lead__sub">Personalised guidance, thoughtful care.</p>

                @if (session('status') && session('lead_form') === 'doctor')
                    <p class="hp-doctor-lead__status" role="status">{{ session('status') }}</p>
                @endif

                <form class="hp-doctor-lead__form" method="post" action="{{ route('contact.store') }}">
                    @csrf
                    <input type="hidden" name="context" value="Homepage doctor lead">
                    <input type="hidden" name="lead_form" value="doctor">
                    <div class="hp-doctor-lead__fields">
                        <label class="hp-sr-only" for="doctor-lead-name">Your Full Name</label>
                        <input
                            id="doctor-lead-name"
                            class="hp-doctor-lead__input"
                            type="text"
                            name="name"
                            value="{{ old('name') }}"
                            placeholder="Your Full Name"
                            autocomplete="name"
                            required
                            maxlength="120"
                        >
                        <label class="hp-sr-only" for="doctor-lead-mobile">Mobile Number</label>
                        <input
                            id="doctor-lead-mobile"
                            class="hp-doctor-lead__input"
                            type="tel"
                            name="contact"
                            value="{{ old('contact') }}"
                            placeholder="Mobile Number"
                            autocomplete="tel"
                            required
                            maxlength="190"
                        >
                        <label class="hp-sr-only" for="doctor-lead-concern">Your Health Concern</label>
                        <input
                            id="doctor-lead-concern"
                            class="hp-doctor-lead__input"
                            type="text"
                            name="message"
                            value="{{ old('message') }}"
                            placeholder="Your Health Concern"
                            required
                            maxlength="5000"
                        >
                    </div>
                    <label class="hp-doctor-lead__consent">
                        <input type="checkbox" name="consent" value="1" required @checked(old('consent'))>
                        <span>I agree to be contacted about this enquiry. This is not emergency care.</span>
                    </label>
                    @if ($errors->any() && old('lead_form') === 'doctor')
                        <p class="hp-doctor-lead__error" role="alert">{{ $errors->first() }}</p>
                    @endif
                    <button class="hp-doctor-lead__submit" type="submit">Talk to a Doctor</button>
                </form>
            </div>
        </div>
    </section>

    <section class="hp-section" id="health-concerns">
        <div class="hp-container">
            <div class="hp-section-head">
                <h2>{{ $categories->title ?? 'Shop by Health Concern' }}</h2>
                <p>{{ $categories->subtitle ?? 'Browse remedies by the concern you care about most.' }}</p>
            </div>
            @if ($homepageCategories->isEmpty())
                <div class="hp-empty">Categories appear once published in admin.</div>
            @else
                <div class="hp-concern-grid">
                    @foreach ($homepageCategories as $category)
                        <a class="hp-concern-card" href="{{ route('shop.category', $category->slug) }}">
                            <span class="hp-concern-card__media" style="background-image:url('{{ $category->image?->publicUrl() ?: 'https://picsum.photos/seed/hp-'.\Illuminate\Support\Str::slug($category->slug).'/400/400' }}')"></span>
                            <span class="hp-concern-card__label">
                                {{ $category->name }}
                                <span aria-hidden="true">→</span>
                            </span>
                        </a>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    <section class="hp-section hp-section--soft" id="trusted-brands">
        <div class="hp-container">
            <div class="hp-section-head">
                <h2>Our Trusted Brands</h2>
                <p>Quality names families already know — curated in one place.</p>
            </div>
            @if ($homepageBrands->isEmpty())
                <div class="hp-empty">Brands appear once published in admin.</div>
            @else
                <div class="hp-brand-row">
                    @foreach ($homepageBrands as $brand)
                        <a class="hp-brand-card" href="{{ route('shop.index', ['brand' => $brand->slug]) }}">
                            <strong>{{ $brand->name }}</strong>
                            <p>{{ $brand->description ?: 'Trusted homeopathic brand.' }}</p>
                            <span>View products →</span>
                        </a>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    <section class="hp-section" id="popular-medicines">
        <div class="hp-container">
            <div class="hp-section-head hp-section-head--row">
                <div>
                    <h2>{{ $featured->title ?? 'Popular Homeopathic Medicines' }}</h2>
                    <p>{{ $featured->subtitle ?? 'Everyday essentials from trusted brands.' }}</p>
                </div>
                <a class="hp-text-link" href="{{ route('shop.index') }}">View all</a>
            </div>
            @if ($featuredProducts->isEmpty())
                <div class="hp-empty">Featured products appear when selected in admin.</div>
            @else
                @include('partials.product-cards', ['products' => $featuredProducts])
            @endif
        </div>
    </section>

    <section class="hp-consult-banner" id="consult-doctors" aria-label="Online consultation">
        <div class="hp-container hp-consult-banner__grid">
            <div class="hp-consult-banner__copy">
                <p class="hp-consult-banner__kicker">Online Consultation</p>
                <h2>Consult Certified Homeopathic Doctors</h2>
                <p class="hp-consult-banner__lead">
                    Get personalised, safe and holistic guidance for your health concerns from our experienced doctors.
                </p>

                <ul class="hp-consult-banner__features">
                    <li>
                        <span class="hp-consult-banner__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="14" height="11" rx="1.5"/><path d="M8 19h4M10 16v3"/><circle cx="19" cy="9" r="2.2"/><path d="M19 11.2v2.3"/></svg>
                        </span>
                        <span>Online Consultation</span>
                    </li>
                    <li>
                        <span class="hp-consult-banner__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3c2.8 3.4 6 5.4 6 9.2a6 6 0 1 1-12 0C6 8.4 9.2 6.4 12 3z"/><path d="M12 13v4"/></svg>
                        </span>
                        <span>Personalised Treatment Plan</span>
                    </li>
                    <li>
                        <span class="hp-consult-banner__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z"/><path d="m9 12 2 2 4-4"/></svg>
                        </span>
                        <span>Safe</span>
                    </li>
                    <li>
                        <span class="hp-consult-banner__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M8 3.5V7M16 3.5V7M3.5 10h17"/></svg>
                        </span>
                        <span>Flexible Scheduling</span>
                    </li>
                </ul>

                <div class="hp-consult-banner__actions">
                    <a class="hp-btn hp-btn--primary" href="{{ route('doctors.index') }}">Browse Doctors →</a>
                    <a class="hp-btn hp-btn--whatsapp" href="{{ $settings->whatsappUrl('Hi, I want to book a doctor consult') }}" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.95L0 24l6.3-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.44zM12.06 21.15h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.98c0 5.45-4.44 9.88-9.89 9.88z"/></svg>
                        Chat on WhatsApp
                    </a>
                </div>
            </div>

            <div class="hp-consult-banner__visual" aria-hidden="true">
                <img
                    src="{{ asset('images/home/consult-banner-art.jpg') }}?v=20261105-consult"
                    alt=""
                    width="1400"
                    height="754"
                    loading="lazy"
                    decoding="async"
                >
            </div>

            <div class="hp-consult-banner__form-card">
                <h3>Book a Consultation</h3>
                <p>Share your details and our team will get in touch to schedule your online consultation.</p>

                @if (session('status') && session('lead_form') === 'consult')
                    <p class="hp-consult-banner__status" role="status">{{ session('status') }}</p>
                @endif

                <form class="hp-consult-banner__form" method="post" action="{{ route('contact.store') }}">
                    @csrf
                    <input type="hidden" name="context" value="Homepage consult booking">
                    <input type="hidden" name="lead_form" value="consult">

                    <label class="hp-consult-field">
                        <span class="hp-sr-only">Full Name</span>
                        <span class="hp-consult-field__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 19a7 7 0 0 1 14 0"/></svg>
                        </span>
                        <input type="text" name="name" value="{{ old('name') }}" placeholder="Full Name*" required maxlength="120" autocomplete="name">
                    </label>

                    <label class="hp-consult-field">
                        <span class="hp-sr-only">WhatsApp Number</span>
                        <span class="hp-consult-field__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
                        </span>
                        <input type="tel" name="contact" value="{{ old('contact') }}" placeholder="WhatsApp Number*" required maxlength="190" autocomplete="tel">
                    </label>

                    <label class="hp-consult-field">
                        <span class="hp-sr-only">Email ID (Optional)</span>
                        <span class="hp-consult-field__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
                        </span>
                        <input type="email" name="email" value="{{ old('email') }}" placeholder="Email ID (Optional)" maxlength="190" autocomplete="email">
                    </label>

                    <label class="hp-consult-field">
                        <span class="hp-sr-only">Select Concern</span>
                        <span class="hp-consult-field__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 4v7a3 3 0 0 0 6 0V4M9 4v16M15 9h4a2 2 0 0 1 0 4h-4"/></svg>
                        </span>
                        <select name="concern" required>
                            <option value="" disabled @selected(! old('concern'))>Select Concern*</option>
                            <option value="Migraine" @selected(old('concern') === 'Migraine')>Migraine</option>
                            <option value="Acidity" @selected(old('concern') === 'Acidity')>Acidity</option>
                            <option value="Hair fall" @selected(old('concern') === 'Hair fall')>Hair fall</option>
                            <option value="PCOS" @selected(old('concern') === 'PCOS')>PCOS</option>
                            <option value="Anxiety" @selected(old('concern') === 'Anxiety')>Anxiety</option>
                            <option value="Other" @selected(old('concern') === 'Other')>Other</option>
                        </select>
                    </label>

                    <label class="hp-consult-field">
                        <span class="hp-sr-only">Side Effects (if any)</span>
                        <span class="hp-consult-field__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 2.5 20h19L12 3z"/><path d="M12 10v4M12 17h.01"/></svg>
                        </span>
                        <select name="side_effects">
                            <option value="">Side Effects (if any)</option>
                            <option value="None" @selected(old('side_effects') === 'None')>None</option>
                            <option value="Mild" @selected(old('side_effects') === 'Mild')>Mild</option>
                            <option value="Moderate" @selected(old('side_effects') === 'Moderate')>Moderate</option>
                            <option value="Severe" @selected(old('side_effects') === 'Severe')>Severe</option>
                        </select>
                    </label>

                    <label class="hp-consult-field hp-consult-field--area">
                        <span class="hp-sr-only">Tell us more about your concern</span>
                        <span class="hp-consult-field__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>
                        </span>
                        <textarea name="message" rows="3" placeholder="Tell us more about your concern*" required maxlength="5000">{{ old('message') }}</textarea>
                    </label>

                    <label class="hp-consult-consent">
                        <input type="checkbox" name="consent" value="1" required @checked(old('consent'))>
                        <span>I agree to be contacted about this consultation. This is not emergency care.</span>
                    </label>

                    @if ($errors->any() && old('lead_form') === 'consult')
                        <p class="hp-consult-banner__error" role="alert">{{ $errors->first() }}</p>
                    @endif

                    <button class="hp-btn hp-btn--primary hp-btn--block" type="submit">Book Now</button>
                </form>
            </div>
        </div>
    </section>

    <section class="hp-section" id="founders">
        <div class="hp-container">
            <div class="hp-section-head">
                <h2>Our Founder &amp; Co-Founder</h2>
                <p>The people behind {{ $settings->brandName() }}.</p>
            </div>
            <div class="hp-founders-layout">
                <div class="hp-founders-grid">
                    @forelse ($homepageFounders as $member)
                        <article class="hp-founder-card">
                            <div class="hp-founder-card__photo" style="@if(!$member->photo) background-image:url('https://picsum.photos/seed/hp-{{ $member->slug }}/600/700') @endif">
                                @if ($member->photo)
                                    <img src="{{ $member->photo->publicUrl() }}" alt="{{ $member->name }}">
                                @endif
                            </div>
                            <div class="hp-founder-card__body">
                                <h3>{{ $member->name }}</h3>
                                <p class="hp-muted">{{ $member->designation }}</p>
                                @if ($member->biography)
                                    <p>{{ \Illuminate\Support\Str::limit($member->biography, 180) }}</p>
                                @endif
                                @if ($member->link_url)
                                    <a class="hp-text-link" href="{{ $member->link_url }}" target="_blank" rel="noopener">Profile</a>
                                @endif
                            </div>
                        </article>
                    @empty
                        <div class="hp-empty">Publish founder profiles in Admin → Founders &amp; Team.</div>
                    @endforelse
                </div>
                <blockquote class="hp-mission-quote">
                    <p>“To bring the goodness of homeopathy to every home and help people live healthier, happier lives naturally.”</p>
                    <footer>— {{ $settings->brandName() }}</footer>
                </blockquote>
            </div>
        </div>
    </section>

    <section class="hp-section hp-section--soft" id="super-deals">
        <div class="hp-container">
            <div class="hp-section-head hp-section-head--row">
                <div>
                    <h2>Super Saving Deals</h2>
                    <p>Limited-time savings on selected medicines.</p>
                </div>
                <a class="hp-text-link" href="{{ route('shop.index', ['sort' => 'price_asc']) }}">See deals</a>
            </div>
            @if ($dealProducts->isEmpty())
                <div class="hp-empty">Sale products appear when sale prices are set in admin.</div>
            @else
                @include('partials.product-cards', ['products' => $dealProducts])
            @endif
        </div>
    </section>

    <section class="hp-section" id="health-library">
        <div class="hp-container">
            <div class="hp-section-head hp-section-head--row">
                <div>
                    <h2>{{ $library->title ?? 'Health Library' }}</h2>
                    <p>{{ $library->subtitle ?? 'Guides and educational reading from our team.' }}</p>
                </div>
                <a class="hp-text-link" href="{{ route('blog.index') }}">View all posts</a>
            </div>
            @if ($homepageBlog->isEmpty())
                <div class="hp-empty">Blog posts appear after publishing.</div>
            @else
                <div class="hp-blog-grid">
                    @foreach ($homepageBlog as $post)
                        <article class="hp-blog-card">
                            <a class="hp-blog-card__media" href="{{ route('health-library.show', $post->slug) }}" style="background-image:url('https://picsum.photos/seed/hp-blog-{{ $post->slug }}/640/400')" aria-label="{{ $post->title }}"></a>
                            <div class="hp-blog-card__body">
                                <h3><a href="{{ route('health-library.show', $post->slug) }}">{{ $post->title }}</a></h3>
                                @if ($post->excerpt)<p>{{ \Illuminate\Support\Str::limit($post->excerpt, 110) }}</p>@endif
                                <p class="hp-muted">
                                    @if ($post->published_at){{ $post->published_at->timezone('Asia/Kolkata')->format('d M Y') }} · @endif
                                    5 min read
                                </p>
                            </div>
                        </article>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    <section class="hp-section hp-section--soft" id="testimonials">
        <div class="hp-container">
            <div class="hp-section-head">
                <h2>What Our Customers Say</h2>
                <p>Real words from people who booked through {{ $settings->brandName() }}.</p>
            </div>
            @if ($homepageTestimonials->isEmpty())
                <div class="hp-empty">Testimonials appear when published in admin.</div>
            @else
                <div class="hp-testimonial-row">
                    @foreach ($homepageTestimonials as $item)
                        <blockquote class="hp-testimonial-card">
                            <div class="hp-stars" aria-label="{{ $item->rating ?? 5 }} star rating">★★★★★</div>
                            <p>“{{ $item->quote }}”</p>
                            <footer>
                                <strong>{{ $item->author_name }}</strong>
                                @if ($item->author_role)<span class="hp-muted"> · {{ $item->author_role }}</span>@endif
                            </footer>
                        </blockquote>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    <section class="hp-newsletter">
        <div class="hp-container hp-newsletter__row">
            <div>
                <h2>Stay Updated</h2>
                <p>Health tips, new arrivals, and consult reminders — no spam.</p>
            </div>
            <form class="hp-newsletter__form" method="get" action="{{ route('contact.show') }}">
                <label class="hp-sr-only" for="newsletter-email">Email</label>
                <input id="newsletter-email" class="hp-input" type="email" name="contact" placeholder="Enter your email" required>
                <button class="hp-btn hp-btn--primary" type="submit">Subscribe</button>
            </form>
        </div>
    </section>

    <section class="hp-trust-strip hp-trust-strip--footer">
        <div class="hp-container hp-trust-strip__grid">
            @foreach (['100% Genuine Products', 'Secure Payments', 'Expert Doctors', 'Easy Returns'] as $label)
                <div class="hp-trust-strip__item">
                    <span class="hp-trust-strip__icon" aria-hidden="true"></span>
                    <strong>{{ $label }}</strong>
                </div>
            @endforeach
        </div>
    </section>
@endsection
