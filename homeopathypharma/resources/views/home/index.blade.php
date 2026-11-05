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

    <section class="hp-consult-banner hp-consult-banner--art" id="consult-doctors" aria-label="Online consultation">
        {{-- Single 2x source via img-raw.php (no srcset): Hostinger CDN downscales /images/* and also
             rewrites srcset picks via client hints; a plain img keeps the full 4000×1336 bytes. --}}
        <img
            class="hp-consult-banner__art"
            src="{{ asset('img-raw.php') }}?f=consult-banner-fullbleed-2x.jpg&v=20261105-consult-crisp3"
            alt="Online consultation — Consult certified homeopathic doctors. Book a consultation, browse doctors, or chat on WhatsApp."
            width="2000"
            height="668"
            loading="eager"
            decoding="async"
            fetchpriority="high"
        >

        @if (session('status') && session('lead_form') === 'consult_banner')
            <p class="hp-consult-banner__status" role="status">{{ session('status') }}</p>
        @endif

        {{-- Real form panel over the painted field stack (title stays from artwork) --}}
        <form
            class="hp-consult-banner__form"
            method="post"
            action="{{ route('contact.store') }}"
            aria-label="Book a consultation"
        >
            @csrf
            <input type="hidden" name="context" value="Homepage consult banner">
            <input type="hidden" name="lead_form" value="consult_banner">
            <input type="hidden" name="consent" value="1">

            <div class="hp-consult-banner__panel">
                <div class="hp-consult-banner__row">
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

                <label class="hp-sr-only" for="consult-banner-concern">Select Concern</label>
                <select
                    id="consult-banner-concern"
                    class="hp-consult-banner__field hp-consult-banner__field--select"
                    name="concern"
                    required
                >
                    <option value="" disabled @selected(old('lead_form') !== 'consult_banner' || old('concern') === null || old('concern') === '')>Select Concern*</option>
                    <option value="Head & Hair" @selected(old('lead_form') === 'consult_banner' && old('concern') === 'Head & Hair')>Head &amp; Hair</option>
                    <option value="Face & Skin" @selected(old('lead_form') === 'consult_banner' && old('concern') === 'Face & Skin')>Face &amp; Skin</option>
                    <option value="Digestion" @selected(old('lead_form') === 'consult_banner' && old('concern') === 'Digestion')>Digestion</option>
                    <option value="Women's Care" @selected(old('lead_form') === 'consult_banner' && old('concern') === "Women's Care")>Women's Care</option>
                    <option value="Child Care" @selected(old('lead_form') === 'consult_banner' && old('concern') === 'Child Care')>Child Care</option>
                    <option value="Immunity" @selected(old('lead_form') === 'consult_banner' && old('concern') === 'Immunity')>Immunity</option>
                    <option value="Stress & Sleep" @selected(old('lead_form') === 'consult_banner' && old('concern') === 'Stress & Sleep')>Stress &amp; Sleep</option>
                    <option value="Other" @selected(old('lead_form') === 'consult_banner' && old('concern') === 'Other')>Other</option>
                </select>

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

                @if ($errors->any() && old('lead_form') === 'consult_banner')
                    <p class="hp-consult-banner__error" role="alert">{{ $errors->first() }}</p>
                @endif

                <button class="hp-consult-banner__submit" type="submit">Book Now</button>
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
            })();
        </script>

        {{-- Invisible hit targets over the left artwork CTAs --}}
        <a
            class="hp-consult-banner__hit hp-consult-banner__hit--doctors"
            href="{{ route('doctors.index') }}"
        >Browse Doctors</a>
        <a
            class="hp-consult-banner__hit hp-consult-banner__hit--whatsapp"
            href="{{ $settings->whatsappUrl('Hi, I want to book a doctor consult') }}"
            target="_blank"
            rel="noopener"
        >Chat on WhatsApp</a>
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
