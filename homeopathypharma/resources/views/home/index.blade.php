@extends('layouts.app')

@section('title', $settings->brandName().' — '.$settings->tagline())
@section('meta_description', $settings->tagline())

@section('content')
    @php($hero = $sections->get('hero'))
    @php($trust = $sections->get('trust'))
    @php($categories = $sections->get('categories'))
    @php($featured = $sections->get('featured_products'))
    @php($consult = $sections->get('consult'))

    <section class="hp-hero">
        <div class="hp-container">
            <div class="hp-hero__inner">
                <h1 class="hp-hero__brand">{{ $settings->brandName() }}</h1>
                <p class="hp-hero__tagline">{{ $hero?->subtitle ?: $settings->tagline() }}</p>
                <div class="hp-btn-row">
                    <a class="hp-btn hp-btn--primary" href="{{ $hero?->payload['primary_cta_href'] ?? route('shop.index') }}">
                        {{ $hero?->payload['primary_cta_label'] ?? 'Shop products' }}
                    </a>
                    <a class="hp-btn hp-btn--secondary" href="#homepage-doctors">
                        Book a doctor · {{ $settings->consultationFeeDisplay() }}
                    </a>
                </div>
            </div>
        </div>
    </section>

    <section class="hp-section" id="homepage-doctors">
        <div class="hp-container">
            <div class="hp-section__head">
                <h2>Consult our doctors</h2>
                <p class="hp-section__lead">{{ $settings->consultationFeeDisplay() }} per session. Our team schedules your Google Meet call with the doctor after you book.</p>
            </div>
            @if ($homepageDoctors->isEmpty())
                <div class="hp-empty">Featured doctors appear here once published and marked “Show on homepage” in Admin → Doctors.</div>
            @else
                <div class="hp-doctor-grid">
                    @foreach ($homepageDoctors as $doctor)
                        <article class="hp-doctor-card">
                            <div class="hp-doctor-card__photo">
                                @if ($doctor->photo)
                                    <img src="{{ $doctor->photo->publicUrl() }}" alt="{{ $doctor->full_name }}">
                                @else
                                    <span aria-hidden="true">{{ collect(explode(' ', $doctor->full_name))->map(fn ($p) => mb_substr($p, 0, 1))->take(2)->implode('') }}</span>
                                @endif
                            </div>
                            <h3>{{ $doctor->full_name }}</h3>
                            <p class="hp-muted">{{ $doctor->designation ?: 'BHMS' }}@if($doctor->years_experience) · {{ $doctor->years_experience }}+ yrs @endif</p>
                            @if ($doctor->expertise_summary)
                                <p>{{ $doctor->expertise_summary }}</p>
                            @elseif ($doctor->specializations)
                                <p>{{ implode(' · ', $doctor->specializations) }}</p>
                            @endif
                            <ul class="hp-doctor-meta">
                                @if ($doctor->registration_number)
                                    <li><strong>Reg. no.</strong> {{ $doctor->registration_number }}</li>
                                @else
                                    <li><strong>Reg. no.</strong> Update in admin</li>
                                @endif
                                <li><strong>Location</strong> {{ trim(($doctor->locality ? $doctor->locality.', ' : '').($doctor->city ?: 'Mumbai')) }}</li>
                                <li><strong>Session</strong> {{ $doctor->formattedFee() ?: $settings->consultationFeeDisplay() }} · Google Meet</li>
                            </ul>
                            <div class="hp-doctor-card__actions">
                                <a class="hp-btn hp-btn--primary" href="{{ route('consultations.create', $doctor->slug) }}">Book session</a>
                                <a class="hp-text-link" href="{{ route('doctors.show', $doctor->slug) }}">View profile</a>
                            </div>
                        </article>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    <section class="hp-section hp-section--alt" id="homepage-founders">
        <div class="hp-container">
            <div class="hp-section__head">
                <h2>Founders</h2>
                <p class="hp-section__lead">Leadership behind {{ $settings->brandName() }}.</p>
            </div>
            @if ($homepageFounders->isEmpty())
                <div class="hp-empty">Publish founder profiles with “Show on homepage” enabled to display them here.</div>
            @else
                <div class="hp-people-grid">
                    @foreach ($homepageFounders as $member)
                        <article class="hp-person-card">
                            <div class="hp-person-card__photo">
                                @if ($member->photo)
                                    <img src="{{ $member->photo->publicUrl() }}" alt="{{ $member->name }}">
                                @else
                                    <span aria-hidden="true">{{ mb_substr($member->name, 0, 1) }}</span>
                                @endif
                            </div>
                            <h3>{{ $member->name }}</h3>
                            <p class="hp-muted">{{ $member->designation }}</p>
                            @if ($member->biography)
                                <p>{{ \Illuminate\Support\Str::limit($member->biography, 160) }}</p>
                            @endif
                        </article>
                    @endforeach
                </div>
                <div class="hp-section__actions">
                    <a class="hp-text-link" href="{{ route('about.founders') }}">Full founders &amp; team</a>
                </div>
            @endif
        </div>
    </section>

    <section class="hp-section" id="homepage-testimonials">
        <div class="hp-container">
            <div class="hp-section__head">
                <h2>Testimonials</h2>
                <p class="hp-section__lead">Words from people who booked through {{ $settings->brandName() }}.</p>
            </div>
            @if ($homepageTestimonials->isEmpty())
                <div class="hp-empty">No published testimonials yet.</div>
            @else
                <div class="hp-quote-grid">
                    @foreach ($homepageTestimonials as $item)
                        <blockquote class="hp-quote">
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

    <section class="hp-section hp-section--alt" id="homepage-case-studies">
        <div class="hp-container">
            <div class="hp-section__head">
                <h2>Case studies</h2>
                <p class="hp-section__lead">Educational briefs on common concerns and how homeopathy approaches them — not personal medical advice.</p>
            </div>
            @if ($homepageCaseStudies->isEmpty())
                <div class="hp-empty">Case studies appear after publishing articles with type “case study”.</div>
            @else
                <div class="hp-article-grid">
                    @foreach ($homepageCaseStudies as $study)
                        <article class="hp-article-card">
                            <h3><a href="{{ route('health-library.show', $study->slug) }}">{{ $study->title }}</a></h3>
                            @if ($study->excerpt)<p>{{ $study->excerpt }}</p>@endif
                        </article>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    <section class="hp-section" id="homepage-blog">
        <div class="hp-container">
            <div class="hp-section__head">
                <h2>From the blog</h2>
                <p class="hp-section__lead">Guides and updates from our health library.</p>
            </div>
            @if ($homepageBlog->isEmpty())
                <div class="hp-empty">No blog posts published yet.</div>
            @else
                <div class="hp-article-grid">
                    @foreach ($homepageBlog as $post)
                        <article class="hp-article-card">
                            <h3><a href="{{ route('health-library.show', $post->slug) }}">{{ $post->title }}</a></h3>
                            @if ($post->excerpt)<p>{{ $post->excerpt }}</p>@endif
                        </article>
                    @endforeach
                </div>
                <div class="hp-section__actions hp-btn-row">
                    <a class="hp-btn hp-btn--secondary" href="{{ route('blog.index') }}">View all posts</a>
                    <a class="hp-btn hp-btn--ghost" href="{{ route('gallery') }}">Instagram gallery</a>
                </div>
            @endif
        </div>
    </section>

    @if ($trust)
        <section class="hp-section hp-section--alt">
            <div class="hp-container">
                <div class="hp-section__head">
                    <h2>{{ $trust->title }}</h2>
                </div>
                <div class="hp-trust">
                    @foreach (($trust->payload['items'] ?? []) as $item)
                        <article class="hp-trust__item">
                            <h3>{{ $item['title'] }}</h3>
                            <p>{{ $item['body'] }}</p>
                        </article>
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    @if ($categories)
        <section class="hp-section">
            <div class="hp-container">
                <div class="hp-section__head">
                    <h2>{{ $categories->title }}</h2>
                    <p class="hp-section__lead">{{ $categories->subtitle }}</p>
                </div>
                @if ($homepageCategories->isEmpty())
                    <div class="hp-empty">No published categories yet.</div>
                @else
                    <div class="hp-category-grid">
                        @foreach ($homepageCategories as $category)
                            <a class="hp-category-tile" href="{{ route('shop.category', $category->slug) }}">
                                @if ($category->image)
                                    <img src="{{ $category->image->publicUrl() }}" alt="{{ $category->image->alt_text ?: $category->name }}">
                                @endif
                                <h3>{{ $category->name }}</h3>
                            </a>
                        @endforeach
                    </div>
                @endif
            </div>
        </section>
    @endif

    @if ($featured)
        <section class="hp-section hp-section--alt">
            <div class="hp-container">
                <div class="hp-section__head">
                    <h2>{{ $featured->title }}</h2>
                    <p class="hp-section__lead">{{ $featured->subtitle }}</p>
                </div>
                @if ($featuredProducts->isEmpty())
                    <div class="hp-empty">No featured products yet.</div>
                @else
                    @include('partials.product-grid', ['products' => $featuredProducts])
                @endif
            </div>
        </section>
    @endif

    @if ($consult)
        <section class="hp-section">
            <div class="hp-container hp-consult">
                <div>
                    <h2>{{ $consult->title }}</h2>
                    <p class="hp-section__lead">{{ $consult->subtitle }}</p>
                    <div class="hp-section__actions">
                        <a class="hp-btn hp-btn--primary" href="#homepage-doctors">Book {{ $settings->consultationFeeDisplay() }} session</a>
                    </div>
                </div>
                <div class="hp-consult__panel">Google Meet · scheduled by our team</div>
            </div>
        </section>
    @endif
@endsection
