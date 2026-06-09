import React, { useState, useEffect } from 'react';
import type { CompetitionData } from '../types';
import competitionData from '../data/competition.json';
import { PlayCircle, X } from 'lucide-react';

function getYouTubeId(url: string): string | null {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

function getYouTubeStart(url: string): number {
  const match = url.match(/[?&]t=(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

const Competition: React.FC = () => {
  const data = competitionData as CompetitionData;
  const [isOpen, setIsOpen] = useState(false);

  const videoId = getYouTubeId(data.videoUrl);
  const start = getYouTubeStart(data.videoUrl);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${start}&rel=0&modestbranding=1`
    : null;

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <section id="competition" className="py-24 bg-white text-zinc-900 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — text content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-brand tracking-widest italic">Nuestra travesía</h3>
              <p className="text-zinc-600 text-lg leading-relaxed font-light">
                {data.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-black uppercase tracking-widest text-sm text-zinc-900">Objetivos</h4>
                <ul className="space-y-2">
                  {data.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start space-x-2 text-zinc-600 text-sm">
                      <span className="text-accent font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-black uppercase tracking-widest text-sm text-zinc-900">La Ruta</h4>
                <ul className="space-y-2">
                  {data.routeFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2 text-zinc-600 text-sm">
                      <span className="text-accent font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right — thumbnail with play button */}
          <button
            onClick={() => setIsOpen(true)}
            className="group relative aspect-video w-full block overflow-hidden shadow-2xl border border-zinc-200 cursor-pointer"
            aria-label="Reproducir video"
          >
            {thumbnail && (
              <img
                src={thumbnail}
                alt="Vista previa del video"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle
                size={88}
                className="text-white drop-shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:text-accent"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Modal / Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {embedUrl && (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Travesía Rieles del Lago"
              />
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-accent transition-colors"
              aria-label="Cerrar video"
            >
              <X size={32} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Competition;
