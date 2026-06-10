import React from 'react';
import type { ArticlesData } from '../types';
import articlesData from '../data/articles.json';
import { Camera, ShoppingBag } from 'lucide-react';

const overlayColor = 'color-mix(in srgb, var(--color-brand) 55%, transparent)';
const overlayHover  = 'color-mix(in srgb, var(--color-brand) 75%, transparent)';

const Articles: React.FC = () => {
  const data = articlesData as ArticlesData;

  return (
    <section id="articles" className="w-full flex flex-col md:flex-row">

      {/* Card 1 — Fotografías */}
      <a
        href={data.photos.galleryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex-1 overflow-hidden h-[35vh] md:h-[45vh]"
      >
        <img
          src={data.photos.image}
          alt="Fotografías oficiales"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{ backgroundColor: overlayColor }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = overlayHover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = overlayColor)}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 gap-3">
          <Camera size={28} className="text-white drop-shadow-lg md:w-10 md:h-10" />
          <h3 className="text-xl md:text-4xl font-black uppercase italic text-white tracking-widest drop-shadow-lg">
            Fotografías Oficiales
          </h3>
          <div className="border border-white px-4 py-2 md:px-6 md:py-3">
            <p className="text-white/80 text-xs md:text-sm uppercase tracking-widest">{data.photos.description}</p>
          </div>
        </div>
      </a>

      {/* Separator — horizontal on mobile, vertical on desktop */}
      <div className="h-px md:h-auto md:w-px bg-white/60 flex-shrink-0 z-10" />

      {/* Card 2 — Artículos */}
      <a
        href={data.shop.shopUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex-1 overflow-hidden h-[35vh] md:h-[45vh]"
      >
        <img
          src={data.shop.image}
          alt="Artículos oficiales"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{ backgroundColor: overlayColor }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = overlayHover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = overlayColor)}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 gap-3">
          <ShoppingBag size={28} className="text-white drop-shadow-lg md:w-10 md:h-10" />
          <h3 className="text-xl md:text-4xl font-black uppercase italic text-white tracking-widest drop-shadow-lg">
            Artículos Oficiales
          </h3>
          <div className="border border-white px-4 py-2 md:px-6 md:py-3">
            <p className="text-white/80 text-xs md:text-sm uppercase tracking-widest">{data.shop.description}</p>
          </div>
        </div>
      </a>

    </section>
  );
};

export default Articles;
