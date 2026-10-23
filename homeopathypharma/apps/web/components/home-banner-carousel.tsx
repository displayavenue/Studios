"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HOME_BANNERS } from "@/lib/content/images";

export function HomeBannerCarousel() {
  const [index, setIndex] = useState(0);
  const total = HOME_BANNERS.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5500);
    return () => window.clearInterval(id);
  }, [total]);

  const banner = HOME_BANNERS[index]!;

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
      <div className="home-banner__dots" role="tablist" aria-label="Banner slides">
        {HOME_BANNERS.map((item, i) => (
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
    </section>
  );
}
