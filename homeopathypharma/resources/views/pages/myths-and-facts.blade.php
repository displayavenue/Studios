@extends('layouts.app')
@section('title', 'Myths vs Facts — '.$settings->brandName())
@section('meta_description', 'Myths vs Facts from '.$settings->brandName().': separate common health beliefs from medical facts. Educational information only.')

@push('head')
    <link rel="canonical" href="{{ route('myths-vs-fact') }}">
    <meta name="robots" content="index,follow,max-snippet:-1">
@endpush

@section('content')
<section class="hp-mvf" aria-labelledby="hp-mvf-title">
    <div class="hp-mvf__frame">
        <header class="hp-mvf__header">
            <nav class="hp-breadcrumb hp-mvf__crumb" aria-label="Breadcrumb">
                <a href="{{ route('home') }}">Home</a> /
                <a href="{{ route('conditions.index') }}">Conditions</a> /
                <span>Myths vs Facts</span>
            </nav>
            <h1 id="hp-mvf-title">Myths vs Facts</h1>
            <p class="hp-mvf__lead">Let’s separate common beliefs from medical facts.</p>
            <div class="hp-mvf__meta">
                <span class="hp-mvf__tag">Health education</span>
                <span class="hp-mvf__count" data-mvf-count>
                    01 — {{ str_pad((string) max($total, 1), 2, '0', STR_PAD_LEFT) }}
                </span>
            </div>
            <div class="hp-btn-row hp-mvf__actions">
                <a class="hp-btn hp-btn--secondary" href="{{ route('conditions.index') }}">A to Z Diseases</a>
                <a class="hp-btn hp-btn--primary" href="{{ route('area-of-consultation') }}">Area of Consultation</a>
            </div>
        </header>

        @if ($items->isEmpty())
            <div class="hp-empty">Myth vs Fact entries will appear here after they are published in Admin.</div>
        @else
            <ol class="hp-mvf__timeline" data-mvf-list>
                @foreach ($items as $index => $item)
                    @php
                        $n = $index + 1;
                        $pad = str_pad((string) $n, 2, '0', STR_PAD_LEFT);
                        $open = false;
                    @endphp
                    <li
                        class="hp-mvf-item{{ $open ? ' is-open' : '' }}"
                        data-mvf-card
                        data-mvf-index="{{ $n }}"
                        id="myth-{{ $n }}"
                    >
                        <div class="hp-mvf-item__rail" aria-hidden="true">
                            <span class="hp-mvf-item__num">{{ $n }}</span>
                            <span class="hp-mvf-item__line"></span>
                        </div>
                        <article class="hp-mvf-card">
                            <p class="hp-mvf-card__myth-label">Myth {{ $pad }}</p>
                            <h2 class="hp-mvf-card__myth">{{ $item->myth_title }}</h2>
                            <button
                                class="hp-mvf-toggle"
                                type="button"
                                data-mvf-toggle
                                aria-expanded="{{ $open ? 'true' : 'false' }}"
                                aria-controls="mvf-fact-{{ $n }}"
                            >
                                <span data-mvf-toggle-label>{{ $open ? 'Hide fact' : 'Show fact' }}</span>
                                <span class="hp-mvf-toggle__chevron" aria-hidden="true"></span>
                            </button>
                            <div
                                class="hp-mvf-fact"
                                id="mvf-fact-{{ $n }}"
                                data-mvf-fact
                                hidden
                            >
                                <p class="hp-mvf-fact__label">Fact</p>
                                <p class="hp-mvf-fact__title">{{ $item->fact_title }}</p>
                                <p class="hp-mvf-fact__body">{{ $item->fact_body }}</p>
                            </div>
                        </article>
                    </li>
                @endforeach
            </ol>
        @endif

        <p class="hp-disclaimer hp-mvf__disclaimer">Educational information only — not a diagnosis or treatment plan. For personal care, use Area of Consultation or WhatsApp {{ $settings->phoneDisplay() }}.</p>
    </div>
</section>
@endsection

@push('scripts')
<script>
(() => {
  const total = {{ (int) $total }};
  const countEl = document.querySelector('[data-mvf-count]');
  const pad = (n) => String(n).padStart(2, '0');

  const setOpen = (item, open) => {
    const btn = item.querySelector('[data-mvf-toggle]');
    const fact = item.querySelector('[data-mvf-fact]');
    const label = item.querySelector('[data-mvf-toggle-label]');
    if (!btn || !fact || !label) return;
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    label.textContent = open ? 'Hide fact' : 'Show fact';
    if (open) fact.removeAttribute('hidden');
    else fact.setAttribute('hidden', '');
  };

  document.querySelectorAll('[data-mvf-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('[data-mvf-card]');
      if (!item) return;
      setOpen(item, !item.classList.contains('is-open'));
    });
  });

  if (!countEl || !('IntersectionObserver' in window)) return;
  const cards = [...document.querySelectorAll('[data-mvf-card]')];
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const idx = Number(visible.target.getAttribute('data-mvf-index') || 1);
    countEl.textContent = `${pad(idx)} — ${pad(Math.max(total, 1))}`;
  }, { root: null, threshold: [0.35, 0.55, 0.75] });
  cards.forEach((card) => observer.observe(card));
})();
</script>
@endpush
