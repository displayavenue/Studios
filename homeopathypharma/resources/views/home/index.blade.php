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

    <section class="hp-hero-banner" aria-label="Homeopathy essentials">
        <div class="hp-container hp-hero-banner__grid">
            <div class="hp-hero-banner__content">
                <p class="hp-hero-banner__eyebrow">{{ $hero->title ?? 'NATURAL. SAFE. EFFECTIVE.' }}</p>
                <h1>{{ $hero->subtitle ?? 'Your Everyday Homeopathy Essentials, Made Easier.' }}</h1>
                <p class="hp-hero-banner__lead">Genuine medicines, trusted brands, and {{ $settings->consultationFeeDisplay() }} online doctor consults — from Mira Road to your home.</p>
                <div class="hp-btn-row">
                    <a class="hp-btn hp-btn--primary" href="{{ $hero->payload['primary_cta_href'] ?? route('shop.index') }}">
                        {{ $hero->payload['primary_cta_label'] ?? 'Shop Medicines' }} →
                    </a>
                    <a class="hp-btn hp-btn--ghost-light" href="{{ $hero->payload['secondary_cta_href'] ?? route('doctors.index') }}">
                        {{ $hero->payload['secondary_cta_label'] ?? 'Consult a Doctor' }} →
                    </a>
                </div>
            </div>
            <div class="hp-hero-banner__media">
                <img
                    src="{{ asset('images/home/hero-banner.jpg') }}"
                    alt="{{ $hero->payload['image_alt'] ?? 'Homeopathy doctor with natural medicines' }}"
                    width="1280"
                    height="720"
                    decoding="async"
                    fetchpriority="high"
                >
            </div>
        </div>
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

    <section class="hp-consult-banner" id="consult-doctors">
        <div class="hp-container hp-consult-banner__grid">
            <div class="hp-consult-banner__copy">
                <h2>{{ $consult->title ?? 'Consult Certified Doctors' }}</h2>
                <p>{{ $consult->subtitle ?? 'Personalised advice with online Google Meet sessions scheduled by our team.' }}</p>
                <ul class="hp-consult-banner__list">
                    <li>Personalised advice</li>
                    <li>Online Google Meet consultation</li>
                    <li>{{ $settings->consultationFeeDisplay() }} session fee</li>
                    <li>Team schedules your call</li>
                </ul>
                <div class="hp-btn-row">
                    <a class="hp-btn hp-btn--primary" href="{{ route('doctors.index') }}">Browse Doctors →</a>
                    <a class="hp-btn hp-btn--secondary" href="{{ $settings->whatsappUrl('Hi, I want to book a doctor consult') }}" target="_blank" rel="noopener">WhatsApp</a>
                </div>
                @if ($homepageDoctors->isNotEmpty())
                    <div class="hp-consult-banner__doctors">
                        @foreach ($homepageDoctors as $doctor)
                            <a href="{{ route('doctors.show', $doctor->slug) }}">{{ $doctor->full_name }}</a>
                        @endforeach
                    </div>
                @endif
            </div>
            <div class="hp-consult-banner__aside">
                <h3>Common concerns</h3>
                <ul>
                    <li><a href="{{ route('conditions.show', 'migraine') }}">Migraine</a></li>
                    <li><a href="{{ route('conditions.show', 'acidity-and-acid-reflux') }}">Acidity</a></li>
                    <li><a href="{{ route('conditions.show', 'hair-fall') }}">Hair fall</a></li>
                    <li><a href="{{ route('conditions.show', 'pcos') }}">PCOS</a></li>
                    <li><a href="{{ route('conditions.show', 'anxiety') }}">Anxiety</a></li>
                    <li><a href="{{ route('conditions.index') }}">All conditions →</a></li>
                </ul>
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
