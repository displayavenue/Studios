<div class="hp-product-rail">
    @foreach ($products as $product)
        @php
            $image = $product->primaryImage();
            $hasSale = $product->sale_price_paise !== null
                && $product->sale_price_paise < $product->price_paise
                && $product->currentPricePaise() === (int) $product->sale_price_paise;
            $discount = $hasSale
                ? (int) round((1 - ($product->sale_price_paise / max(1, $product->price_paise))) * 100)
                : 0;
        @endphp
        <article class="hp-prod-card">
            @if ($discount > 0)
                <span class="hp-prod-card__badge">{{ $discount }}% OFF</span>
            @endif
            <a class="hp-prod-card__media" href="{{ route('product.show', $product->slug) }}">
                @if ($image)
                    <img src="{{ $image->publicUrl() }}" alt="{{ $image->alt_text ?: $product->name }}">
                @else
                    <span class="hp-prod-card__placeholder" style="background-image:url('https://picsum.photos/seed/hp-prod-{{ $product->slug }}/400/400')"></span>
                @endif
            </a>
            <div class="hp-prod-card__body">
                @if ($product->brand)
                    <p class="hp-prod-card__brand">{{ $product->brand->name }}</p>
                @endif
                <h3><a href="{{ route('product.show', $product->slug) }}">{{ $product->name }}</a></h3>
                @if ($product->package_size)
                    <p class="hp-muted">{{ $product->package_size }}</p>
                @endif
                <p class="hp-prod-card__price">
                    <span class="hp-prod-card__now">{{ $product->formattedPrice() }}</span>
                    @if ($hasSale)
                        <span class="hp-prod-card__was">₹{{ number_format($product->price_paise / 100, 2) }}</span>
                    @endif
                </p>
                @if ($product->isPurchasable())
                    <form method="post" action="{{ route('cart.add', $product) }}">
                        @csrf
                        <input type="hidden" name="quantity" value="1">
                        <button class="hp-btn hp-btn--primary hp-btn--block" type="submit">Add to Cart</button>
                    </form>
                @else
                    <a class="hp-btn hp-btn--secondary hp-btn--block" href="{{ route('product.show', $product->slug) }}">View</a>
                @endif
            </div>
        </article>
    @endforeach
</div>
