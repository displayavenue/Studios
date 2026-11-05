@extends('layouts.app')

@section('title', $settings->brandName().' — '.$settings->tagline())
@section('meta_description', $settings->tagline())

@section('content')
    @php($hero = $sections->get('hero'))
    @php($heroData = $hero?->data() ?? [])
    @php($trust = $sections->get('trust'))
    @php($trustData = $trust?->data() ?? [])
    @php($doctorLead = $sections->get('doctor_lead'))
    @php($doctorLeadData = $doctorLead?->data() ?? [])
    @php($categories = $sections->get('categories'))
    @php($brands = $sections->get('brands'))
    @php($featured = $sections->get('featured_products'))
    @php($featuredData = $featured?->data() ?? [])
    @php($consult = $sections->get('consult'))
    @php($consultData = $consult?->data() ?? [])
    @php($founders = $sections->get('founders'))
    @php($foundersData = $founders?->data() ?? [])
    @php($deals = $sections->get('deals'))
    @php($dealsData = $deals?->data() ?? [])
    @php($library = $sections->get('health_library'))
    @php($libraryData = $library?->data() ?? [])
    @php($testimonials = $sections->get('testimonials'))
    @php($newsletter = $sections->get('newsletter'))
    @php($newsletterData = $newsletter?->data() ?? [])
    @php($footerTrust = $sections->get('footer_trust'))
    @php($footerTrustData = $footerTrust?->data() ?? [])

    @if ($hero)
    @php($heroImageUrl = $hero->imageUrl('images/home/hero-personal-doctors-v3.jpg'))
    <section class="hp-hero-banner hp-hero-banner--art" aria-label="Homeopathy Pharma">
        <img
            class="hp-hero-banner__art"
            src="{{ $heroImageUrl }}{{ empty($heroData['media_asset_id']) && !empty($heroData['image_version']) ? '?v='.$heroData['image_version'] : '' }}"
            alt="{{ $heroData['image_alt'] ?? ($hero->title ?? 'Homeopathy Pharma') }}"
            width="2000"
            height="751"
            decoding="async"
            fetchpriority="high"
        >
        <h1 class="hp-sr-only">{{ $hero->title ?? 'A More Personal Approach to Healthcare.' }}</h1>
        <a
            class="hp-hero-banner__hit hp-hero-banner__hit--consult"
            href="{{ $heroData['primary_cta_href'] ?? route('doctors.index') }}"
        >{{ $heroData['primary_cta_label'] ?? 'Consult a Doctor' }}</a>
        <a
            class="hp-hero-banner__hit hp-hero-banner__hit--shop"
            href="{{ $heroData['secondary_cta_href'] ?? route('shop.index') }}"
        >{{ $heroData['secondary_cta_label'] ?? 'Explore Remedies' }}</a>
    </section>
    @endif

    @if ($trust)
        <section class="hp-trust-strip">
            <div class="hp-container hp-trust-strip__grid">
                @foreach (($trustData['items'] ?? []) as $item)
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

    @if ($doctorLead)
    <section class="hp-doctor-lead" id="talk-to-doctor" aria-label="Talk to a doctor">
        <div class="hp-doctor-lead__card">
            <div class="hp-doctor-lead__inner">
                <h2>{{ $doctorLead->title }}</h2>
                <p class="hp-doctor-lead__sub">{{ $doctorLead->subtitle }}</p>

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
                        <span>{{ $doctorLeadData['consent_text'] ?? 'I agree to be contacted about this enquiry. This is not emergency care.' }}</span>
                    </label>
                    @if ($errors->any() && old('lead_form') === 'doctor')
                        <p class="hp-doctor-lead__error" role="alert">{{ $errors->first() }}</p>
                    @endif
                    <button class="hp-doctor-lead__submit" type="submit">{{ $doctorLeadData['submit_label'] ?? 'Talk to a Doctor' }}</button>
                </form>
            </div>
        </div>
    </section>
    @endif

    @if ($categories)
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
    @endif

    @if ($brands)
    <section class="hp-section hp-section--soft" id="trusted-brands">
        <div class="hp-container">
            <div class="hp-section-head">
                <h2>{{ $brands->title ?? 'Our Trusted Brands' }}</h2>
                <p>{{ $brands->subtitle ?? 'Quality names families already know — curated in one place.' }}</p>
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
    @endif

    @if ($featured)
    <section class="hp-section" id="popular-medicines">
        <div class="hp-container">
            <div class="hp-section-head hp-section-head--row">
                <div>
                    <h2>{{ $featured->title ?? 'Popular Homeopathic Medicines' }}</h2>
                    <p>{{ $featured->subtitle ?? 'Everyday essentials from trusted brands.' }}</p>
                </div>
                <a class="hp-text-link" href="{{ $featuredData['view_all_href'] ?? route('shop.index') }}">{{ $featuredData['view_all_label'] ?? 'View all' }}</a>
            </div>
            @if ($featuredProducts->isEmpty())
                <div class="hp-empty">Featured products appear when selected in admin.</div>
            @else
                @include('partials.product-cards', ['products' => $featuredProducts])
            @endif
        </div>
    </section>
    @endif

    @if ($consult)
    @php($consultImageUrl = $consult->imageUrl('img-raw.php?f=consult-banner-visual-2x.jpg&v=20261105-consult-one-card'))
    <section class="hp-consult-banner hp-consult-banner--split" id="consult-doctors" aria-label="Online consultation">
        <div class="hp-consult-banner__visual">
            <img
                class="hp-consult-banner__art"
                src="{{ $consultImageUrl }}"
                alt="{{ $consultData['image_alt'] ?? 'Online consultation' }}"
                width="2420"
                height="1336"
                loading="eager"
                decoding="async"
                fetchpriority="high"
            >
            <a
                class="hp-consult-banner__hit hp-consult-banner__hit--doctors"
                href="{{ $consultData['doctors_cta_href'] ?? route('doctors.index') }}"
            >{{ $consultData['doctors_cta_label'] ?? 'Browse Doctors' }}</a>
            <a
                class="hp-consult-banner__hit hp-consult-banner__hit--whatsapp"
                href="{{ $settings->whatsappUrl($consultData['whatsapp_prefill'] ?? 'Hi, I want to book a doctor consult') }}"
                target="_blank"
                rel="noopener"
            >{{ $consultData['whatsapp_cta_label'] ?? 'Chat on WhatsApp' }}</a>
        </div>

        <form
            class="hp-consult-banner__form"
            method="post"
            action="{{ route('contact.store') }}"
            enctype="multipart/form-data"
            aria-label="Book a consultation"
        >
            @csrf
            <input type="hidden" name="context" value="Homepage consult banner">
            <input type="hidden" name="lead_form" value="consult_banner">
            <input type="hidden" name="consent" value="1">

            <div class="hp-consult-banner__panel">
                @if (session('status') && session('lead_form') === 'consult_banner')
                    <p class="hp-consult-banner__status" role="status">{{ session('status') }}</p>
                @endif

                <div class="hp-consult-banner__intro">
                    <h2 class="hp-consult-banner__title">{{ $consultData['form_title'] ?? ($consult->title ?? 'Book a Consultation') }}</h2>
                    <p class="hp-consult-banner__lead">{{ $consultData['form_lead'] ?? ($consult->subtitle ?? 'Share your details and our team will get in touch to schedule your online consultation.') }}</p>
                </div>

                <div class="hp-consult-banner__row">
                    <div class="hp-consult-banner__control">
                        <span class="hp-consult-banner__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.25"/><path d="M5.2 19.4c1.5-3.3 3.8-5 6.8-5s5.3 1.7 6.8 5"/></svg>
                        </span>
                        <label class="hp-sr-only" for="consult-banner-name">Full Name</label>
                        <input
                            id="consult-banner-name"
                            class="hp-consult-banner__field"
                            type="text"
                            name="name"
                            value="{{ old('lead_form') === 'consult_banner' ? old('name') : '' }}"
                            autocomplete="name"
                            required
                            maxlength="120"
                            placeholder="Full Name*"
                            enterkeyhint="next"
                        >
                    </div>

                    <div class="hp-consult-banner__control">
                        <span class="hp-consult-banner__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M7.1 3.7c.5-.5 1.35-.5 1.85 0l1.75 1.75c.5.5.5 1.25.05 1.75L9.2 9.1c.75 1.55 2.1 2.9 3.65 3.65l2.05-1.55c.5-.4 1.25-.4 1.75.1l1.75 1.75c.5.5.5 1.35 0 1.85l-1.15 1.15c-.65.65-1.55.95-2.5.7-2.4-.45-4.7-1.9-6.75-3.95S5.15 9.05 4.7 6.65c-.25-.95.05-1.85.7-2.5l1.7-1.45z"/></svg>
                        </span>
                        <label class="hp-sr-only" for="consult-banner-contact">WhatsApp Number</label>
                        <input
                            id="consult-banner-contact"
                            class="hp-consult-banner__field"
                            type="tel"
                            name="contact"
                            value="{{ old('lead_form') === 'consult_banner' ? old('contact') : '' }}"
                            autocomplete="tel"
                            inputmode="tel"
                            required
                            maxlength="190"
                            placeholder="WhatsApp Number*"
                            enterkeyhint="next"
                        >
                    </div>
                </div>

                <div class="hp-consult-banner__control">
                    <span class="hp-consult-banner__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3.4" y="5.4" width="17.2" height="13.2" rx="2.2"/><path d="m4.6 7.6 7.4 5.9 7.4-5.9"/></svg>
                    </span>
                    <label class="hp-sr-only" for="consult-banner-email">Email ID (Optional)</label>
                    <input
                        id="consult-banner-email"
                        class="hp-consult-banner__field"
                        type="email"
                        name="email"
                        value="{{ old('lead_form') === 'consult_banner' ? old('email') : '' }}"
                        autocomplete="email"
                        inputmode="email"
                        maxlength="190"
                        placeholder="Email ID (Optional)"
                        enterkeyhint="next"
                    >
                </div>

                <div class="hp-consult-banner__control">
                    <span class="hp-consult-banner__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 14.6v-3.4a2.4 2.4 0 0 1 2.4-2.4h.5"/><path d="M9.7 8.8h2.2a2.4 2.4 0 0 1 2.4 2.4V17"/><circle cx="6.8" cy="16.7" r="2.3"/><circle cx="14.3" cy="16.7" r="2.3"/><path d="M16.6 9V7.2a2 2 0 0 1 2-2h.4"/></svg>
                    </span>
                    <label class="hp-sr-only" for="consult-banner-concern">Select Concern</label>
                    <select
                        id="consult-banner-concern"
                        class="hp-consult-banner__field hp-consult-banner__field--select"
                        name="concern"
                        required
                    >
                        <option value="" disabled @selected(old('lead_form') !== 'consult_banner' || old('concern') === null || old('concern') === '')>Select Concern*</option>
                        @foreach (($consultData['concerns'] ?? []) as $concernOption)
                            <option value="{{ $concernOption }}" @selected(old('lead_form') === 'consult_banner' && old('concern') === $concernOption)>{{ $concernOption }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="hp-consult-banner__control">
                    <span class="hp-consult-banner__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.8 4.5 18.4h15L12 3.8z"/><path d="M12 9v4.6"/><circle cx="12" cy="16.4" r="0.85" fill="currentColor" stroke="none"/></svg>
                    </span>
                    <label class="hp-sr-only" for="consult-banner-side-effects">Side Effects (if any)</label>
                    <input
                        id="consult-banner-side-effects"
                        class="hp-consult-banner__field"
                        type="text"
                        name="side_effects"
                        value="{{ old('lead_form') === 'consult_banner' ? old('side_effects') : '' }}"
                        maxlength="190"
                        placeholder="Side Effects (if any)"
                        enterkeyhint="next"
                    >
                </div>

                <div class="hp-consult-banner__control hp-consult-banner__control--message">
                    <span class="hp-consult-banner__icon hp-consult-banner__icon--top" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3.6h7.4L19.2 8.4V20a1.1 1.1 0 0 1-1.1 1.1H7A1.1 1.1 0 0 1 5.9 20V4.7A1.1 1.1 0 0 1 7 3.6z"/><path d="M14.2 3.6v4.4h4.9"/><path d="M9 12.2h6.2M9 15.4h6.2"/></svg>
                    </span>
                    <label class="hp-sr-only" for="consult-banner-message">Tell us more about your concern</label>
                    <textarea
                        id="consult-banner-message"
                        class="hp-consult-banner__field hp-consult-banner__field--message"
                        name="message"
                        required
                        maxlength="5000"
                        rows="3"
                        placeholder="Tell us more about your concern*"
                        enterkeyhint="send"
                    >{{ old('lead_form') === 'consult_banner' ? old('message') : '' }}</textarea>
                </div>

                <div class="hp-consult-banner__upload">
                    <span class="hp-consult-banner__upload-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="m15.2 7.2-6.5 6.5a2.3 2.3 0 1 0 3.25 3.25l7.1-7.1a3.7 3.7 0 0 0-5.23-5.23L6.7 11.75"/></svg>
                    </span>
                    <div class="hp-consult-banner__upload-copy">
                        <strong>{{ $consultData['upload_title'] ?? 'Add Medical Report or Diseased Photo' }}</strong> <span>(Optional)</span>
                        <small>{{ $consultData['upload_hint'] ?? 'JPG, PNG or PDF (Max 10 MB)' }}</small>
                    </div>
                    <label class="hp-consult-banner__upload-btn" for="consult-banner-attachment">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16.5V5.2"/><path d="m7.8 9.2 4.2-4 4.2 4"/><path d="M5 18.8h14"/></svg>
                        Upload
                    </label>
                    <input
                        id="consult-banner-attachment"
                        class="hp-consult-banner__upload-input"
                        type="file"
                        name="attachment"
                        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                    >
                    <span class="hp-consult-banner__upload-name" id="consult-banner-attachment-name" hidden></span>
                </div>

                @if ($errors->any() && old('lead_form') === 'consult_banner')
                    <p class="hp-consult-banner__error" role="alert">{{ $errors->first() }}</p>
                @endif

                <button class="hp-consult-banner__submit" type="submit">{{ $consultData['submit_label'] ?? 'Book Now' }}</button>
            </div>
        </form>
        <script>
            (function () {
                var root = document.getElementById('consult-doctors');
                if (!root) return;
                root.querySelectorAll('.hp-consult-banner__field').forEach(function (el) {
                    if (el.tagName === 'SELECT') return;
                    var ph = el.getAttribute('placeholder') || '';
                    el.addEventListener('focus', function () { el.setAttribute('placeholder', ''); });
                    el.addEventListener('blur', function () {
                        if (!el.value) el.setAttribute('placeholder', ph);
                    });
                });
                var fileInput = document.getElementById('consult-banner-attachment');
                var fileName = document.getElementById('consult-banner-attachment-name');
                if (fileInput && fileName) {
                    fileInput.addEventListener('change', function () {
                        var file = fileInput.files && fileInput.files[0];
                        if (!file) {
                            fileName.hidden = true;
                            fileName.textContent = '';
                            return;
                        }
                        fileName.hidden = false;
                        fileName.textContent = file.name;
                    });
                }
            })();
        </script>
    </section>
    @endif

    @if ($founders)
    <section class="hp-section" id="founders">
        <div class="hp-container">
            <div class="hp-section-head">
                <h2>{{ $founders->title ?? 'Our Founder & Co-Founder' }}</h2>
                <p>{{ $founders->subtitle ?? ('The people behind '.$settings->brandName().'.') }}</p>
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
                    <p>“{{ $foundersData['mission_quote'] ?? 'To bring the goodness of homeopathy to every home and help people live healthier, happier lives naturally.' }}”</p>
                    <footer>— {{ $foundersData['mission_attribution'] ?? $settings->brandName() }}</footer>
                </blockquote>
            </div>
        </div>
    </section>
    @endif

    @if ($deals)
    <section class="hp-section hp-section--soft" id="super-deals">
        <div class="hp-container">
            <div class="hp-section-head hp-section-head--row">
                <div>
                    <h2>{{ $deals->title ?? 'Super Saving Deals' }}</h2>
                    <p>{{ $deals->subtitle ?? 'Limited-time savings on selected medicines.' }}</p>
                </div>
                <a class="hp-text-link" href="{{ $dealsData['view_all_href'] ?? route('shop.index', ['sort' => 'price_asc']) }}">{{ $dealsData['view_all_label'] ?? 'See deals' }}</a>
            </div>
            @if ($dealProducts->isEmpty())
                <div class="hp-empty">Sale products appear when sale prices are set in admin.</div>
            @else
                @include('partials.product-cards', ['products' => $dealProducts])
            @endif
        </div>
    </section>
    @endif

    @if ($library)
    <section class="hp-section" id="health-library">
        <div class="hp-container">
            <div class="hp-section-head hp-section-head--row">
                <div>
                    <h2>{{ $library->title ?? 'Health Library' }}</h2>
                    <p>{{ $library->subtitle ?? 'Guides and educational reading from our team.' }}</p>
                </div>
                <a class="hp-text-link" href="{{ $libraryData['view_all_href'] ?? route('blog.index') }}">{{ $libraryData['view_all_label'] ?? 'View all posts' }}</a>
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
    @endif

    @if ($testimonials)
    <section class="hp-section hp-section--soft" id="testimonials">
        <div class="hp-container">
            <div class="hp-section-head">
                <h2>{{ $testimonials->title ?? 'What Our Customers Say' }}</h2>
                <p>{{ $testimonials->subtitle ?? ('Real words from people who booked through '.$settings->brandName().'.') }}</p>
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
    @endif

    @if ($newsletter)
    <section class="hp-newsletter">
        <div class="hp-container hp-newsletter__row">
            <div>
                <h2>{{ $newsletter->title ?? 'Stay Updated' }}</h2>
                <p>{{ $newsletter->subtitle ?? 'Health tips, new arrivals, and consult reminders — no spam.' }}</p>
            </div>
            <form class="hp-newsletter__form" method="get" action="{{ route('contact.show') }}">
                <label class="hp-sr-only" for="newsletter-email">Email</label>
                <input id="newsletter-email" class="hp-input" type="email" name="contact" placeholder="{{ $newsletterData['placeholder'] ?? 'Enter your email' }}" required>
                <button class="hp-btn hp-btn--primary" type="submit">{{ $newsletterData['submit_label'] ?? 'Subscribe' }}</button>
            </form>
        </div>
    </section>
    @endif

    @if ($footerTrust)
    <section class="hp-trust-strip hp-trust-strip--footer">
        <div class="hp-container hp-trust-strip__grid">
            @foreach (($footerTrustData['labels'] ?? []) as $label)
                <div class="hp-trust-strip__item">
                    <span class="hp-trust-strip__icon" aria-hidden="true"></span>
                    <strong>{{ $label }}</strong>
                </div>
            @endforeach
        </div>
    </section>
    @endif
@endsection
