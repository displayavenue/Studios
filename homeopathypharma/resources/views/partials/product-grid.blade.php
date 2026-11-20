<div class="hp-product-grid">
    @foreach ($products as $product)
        @php
            $image = $product->primaryImage();
            $discount = $product->discountPercent();
        @endphp
        <article class="hp-product-card">
            <a href="{{ route('product.show', $product->slug) }}">
                @if ($discount > 0)
                    <span class="hp-product-card__badge">{{ $discount }}% OFF</span>
                @endif
                @if ($image)
                    <img src="{{ $image->publicUrl() }}" alt="{{ $image->alt_text ?: $product->name }}">
                @else
                    <div class="hp-product-card__placeholder" aria-hidden="true"></div>
                @endif
                @if ($product->brand)
                    <p class="hp-product-card__brand">{{ $product->brand->name }}</p>
                @endif
                <h3>{{ $product->name }}</h3>
                <p class="hp-product-card__price">
                    <span class="hp-product-card__now">{{ $product->formattedPrice() }}</span>
                    @if ($product->hasActiveSale())
                        <span class="hp-product-card__was">{{ $product->formattedMarketPrice() }}</span>
                    @endif
                </p>
                <p class="hp-product-card__meta">{{ $product->isPurchasable() ? 'In stock' : 'Unavailable' }}</p>
            </a>
        </article>
    @endforeach
</div>
