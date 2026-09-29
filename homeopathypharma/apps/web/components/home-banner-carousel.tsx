"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type HomeBannerSlide = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

export function HomeBannerCarousel({ slides }: { slides: HomeBannerSlide[] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  useEffect(() => {
    if (total < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5500);
    return () => window.clearInterval(id);
  }, [total]);

  if (!slides.length) return null;
  const banner = slides[index]!;

  return (
    <section className="home-banner" aria-roledescription="carousel" aria-label="Offers and highlights">
      <div className="home-banner__slide">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner.image} alt="" className="home-banner__img" width={1600} height={900} />
        <div className="home-banner__shade" aria-hidden="true" />
        <div className="home-banner__copy">
          <h1 className="font-display">{banner.title}</h1>
          <p>{banner.subtitle}</p>
          <Link href={banner.ctaHref} className="home-banner__cta hp-focus-ring">
            {banner.ctaLabel}
          </Link>
        </div>
      </div>
      {total > 1 ? (
        <div className="home-banner__dots" role="tablist" aria-label="Banner slides">
          {slides.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}`}
              className={`home-banner__dot${i === index ? " is-active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
