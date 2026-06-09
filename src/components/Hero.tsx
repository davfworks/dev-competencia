import React, { useState } from 'react';
import type { HeroData } from '../types';
import heroData from '../data/hero.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike } from 'lucide-react';

function splitAtLastSpace(str: string): [string, string] {
  const idx = str.lastIndexOf(' ');
  return idx === -1 ? [str, ''] : [str.slice(0, idx), str.slice(idx + 1)];
}

const Hero: React.FC = () => {
  const data = heroData as HeroData;
  const [editionTop, editionBottom] = splitAtLastSpace(data.edition);
  const [dateTop, dateBottom] = splitAtLastSpace(data.date);
  const [videoReady, setVideoReady] = useState(false);

  const renderBackground = () => {
    switch (data.video.type) {
      case 'youtube':
        return (
          <iframe
            className="w-full h-full object-cover scale-[1.5]"
            src={`${data.video.src}?autoplay=1&mute=1&loop=1&playlist=${data.video.src.split('/').pop()}&controls=0&showinfo=0&rel=0`}
            allow="autoplay; fullscreen"
            frameBorder="0"
          />
        );
      case 'vimeo':
        return (
          <iframe
            src={`${data.video.src}?autoplay=1&loop=1&background=1&muted=1`}
            className="w-full h-full object-cover scale-[1.5]"
            allow="autoplay; fullscreen"
            frameBorder="0"
          />
        );
      case 'local':
      default:
        return (
          <>
            <AnimatePresence>
              {!videoReady && (
                <motion.div
                  key="loader"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center gap-4"
                >
                  <motion.div
                    animate={{ x: [-8, 8, -8] }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
                  >
                    <Bike size={56} className="text-accent" />
                  </motion.div>
                  <p className="text-white text-xs uppercase tracking-[0.3em] opacity-50">Cargando...</p>
                </motion.div>
              )}
            </AnimatePresence>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlayThrough={() => setVideoReady(true)}
              className="w-full h-full object-cover"
            >
              <source src={data.video.src} type="video/mp4" />
            </video>
          </>
        );
    }
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="w-full h-full">
          {renderBackground()}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 h-full flex flex-col py-20">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-black tracking-[0.3em] leading-tight"
          >
            <div className="text-white text-sm md:text-3xl">{editionTop}</div>
            <div className="text-accent text-sm md:text-3xl">{editionBottom}</div>
          </motion.div>

          <div className="hidden md:block" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-black tracking-[0.3em] leading-tight text-right"
          >
            <div className="text-white text-sm md:text-3xl">{dateTop}</div>
            <div className="text-accent text-sm md:text-3xl">{dateBottom}</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <img src={data.logo} alt="Logo" className="w-48 md:w-80 mb-8" />
          <p className="text-white text-lg md:text-2xl font-light tracking-[0.2em] uppercase max-w-2xl px-4">
            {data.slogan}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
