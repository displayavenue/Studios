@if ($paginator->hasPages())
    <nav class="hp-pagination" role="navigation" aria-label="Pagination Navigation">
        <ul class="hp-pagination__list">
            {{-- Previous --}}
            <li class="hp-pagination__item">
                @if ($paginator->onFirstPage())
                    <span class="hp-pagination__box hp-pagination__box--disabled" aria-disabled="true" aria-label="{{ __('pagination.previous') }}">
                        <span aria-hidden="true">&laquo;</span>
                    </span>
                @else
                    <a class="hp-pagination__box" href="{{ $paginator->previousPageUrl() }}" rel="prev" aria-label="{{ __('pagination.previous') }}">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                @endif
            </li>

            {{-- Page numbers --}}
            @foreach ($elements as $element)
                @if (is_string($element))
                    <li class="hp-pagination__item">
                        <span class="hp-pagination__box hp-pagination__box--ellipsis" aria-hidden="true">{{ $element }}</span>
                    </li>
                @endif

                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        <li class="hp-pagination__item">
                            @if ($page == $paginator->currentPage())
                                <span class="hp-pagination__box hp-pagination__box--current" aria-current="page">{{ $page }}</span>
                            @else
                                <a class="hp-pagination__box" href="{{ $url }}">{{ $page }}</a>
                            @endif
                        </li>
                    @endforeach
                @endif
            @endforeach

            {{-- Next --}}
            <li class="hp-pagination__item">
                @if ($paginator->hasMorePages())
                    <a class="hp-pagination__box" href="{{ $paginator->nextPageUrl() }}" rel="next" aria-label="{{ __('pagination.next') }}">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                @else
                    <span class="hp-pagination__box hp-pagination__box--disabled" aria-disabled="true" aria-label="{{ __('pagination.next') }}">
                        <span aria-hidden="true">&raquo;</span>
                    </span>
                @endif
            </li>
        </ul>
    </nav>
@endif
