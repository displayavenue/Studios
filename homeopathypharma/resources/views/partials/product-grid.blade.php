<div class="hp-product-grid">
    @foreach ($products as $product)
        @php($image = $product->primaryImage())
        <article class="hp-product-card">
            <a href="{{ route('product.show', $product->slug) }}">
                @if ($image)
                    <img src="{{ $image->publicUrl() }}" alt="{{ $image->alt_text ?: $product->name }}">
                @else
                    <div class="hp-product-card__placeholder" aria-hidden="true"></div>
                @endif
                <h3>{{ $product->name }}</h3>
                <p class="hp-product-card__price">{{ $product->formattedPrice() }}</p>
                <p class="hp-product-card__meta">{{ $product->isPurchasable() ? 'In stock' : 'Unavailable' }}</p>
            </a>
        </article>
    @endforeach
</div>
