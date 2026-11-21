@if ($paginator->hasPages())
    @php
        $windowSize = 10;
        $current = $paginator->currentPage();
        $last = $paginator->lastPage();
        $windowStart = (int) (floor(($current - 1) / $windowSize) * $windowSize) + 1;
        $windowEnd = min($last, $windowStart + $windowSize - 1);
        $prevWindowPage = $windowStart > 1 ? max(1, $windowStart - $windowSize) : null;
        $nextWindowPage = $windowEnd < $last ? $windowStart + $windowSize : null;
    @endphp
    <nav class="hp-pagination" role="navigation" aria-label="Pagination Navigation">
        <ul class="hp-pagination__list">
            {{-- Previous set of page numbers (1-10 ← 11-20) --}}
            @if ($prevWindowPage !== null)
                <li class="hp-pagination__item">
                    <a
                        class="hp-pagination__box hp-pagination__box--set"
                        href="{{ $paginator->url($prevWindowPage) }}"
                        aria-label="Previous page numbers"
                    >
                        <span aria-hidden="true">‹</span>
                    </a>
                </li>
            @endif

            {{-- Current window of page numbers --}}
            @for ($page = $windowStart; $page <= $windowEnd; $page++)
                <li class="hp-pagination__item">
                    @if ($page === $current)
                        <span class="hp-pagination__box hp-pagination__box--current" aria-current="page">{{ $page }}</span>
                    @else
                        <a class="hp-pagination__box" href="{{ $paginator->url($page) }}">{{ $page }}</a>
                    @endif
                </li>
            @endfor

            {{-- Next set of page numbers (1-10 → 11-20) --}}
            @if ($nextWindowPage !== null)
                <li class="hp-pagination__item">
                    <a
                        class="hp-pagination__box hp-pagination__box--set"
                        href="{{ $paginator->url($nextWindowPage) }}"
                        aria-label="Next page numbers"
                    >
                        <span aria-hidden="true">›</span>
                    </a>
                </li>
            @endif
        </ul>
    </nav>
@endif
