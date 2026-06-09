import React from 'react';
import type { SponsorsData } from '../types';
import sponsorsData from '../data/sponsors.json';

const Sponsors: React.FC = () => {
  const data = sponsorsData as SponsorsData;

  const tiers = [
    { label: 'Patrocinador Principal', logos: data.main },
    { label: 'Sponsors', logos: data.sponsors },
    { label: 'Aliados', logos: data.allies },
  ];

  return (
    <section id="sponsors" className="py-24 bg-zinc-100 px-6">
      <div className="max-w-7xl mx-auto">
<div className="space-y-16">
          {tiers.map(({ label, logos }) =>
            logos.length > 0 ? (
              <div key={label} className="flex flex-col items-center">
                <h3 className="text-xl font-black uppercase tracking-widest text-zinc-500 mb-8">
                  {label}
                </h3>
                <div className="flex flex-wrap justify-center gap-10 items-center">
                  {logos.map((logo) => (
                    <img
                      key={logo.name}
                      src={logo.image}
                      alt={logo.name}
                      loading="lazy"
                      className="h-16 w-32 object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                    />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
