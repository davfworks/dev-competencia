import React, { useState, useEffect } from 'react';
import type { HeroData } from '../types';
import heroData from '../data/hero.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike } from 'lucide-react';

function splitAtLastSpace(str: string): [string, string] {
  const idx = str.lastIndexOf(' ');
  return idx === -1 ? [str, ''] : [str.slice(0, idx), str.slice(idx + 1)];
}

const topVariants    = { exit: { y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const } } };
const bottomVariants = { exit: { y:  '100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const } } };
const iconVariants   = { exit: { opacity: 0, scale: 0.7, transition: { duration: 0.25 } } };
const wrapVariants   = { exit: { transition: { when: 'afterChildren' as const } } };

const Hero: React.FC = () => {
  const data = heroData as HeroData;
  const [editionTop, editionBottom] = splitAtLastSpace(data.edition);
  const [dateTop, dateBottom] = splitAtLastSpace(data.date);
  const [videoReady, setVideoReady] = useState(data.video.type !== 'local');
  const [minDelayDone, setMinDelayDone] = useState(false);
  const showLoader = !videoReady || !minDelayDone;

  useEffect(() => {
    const t = setTimeout(() => setMinDelayDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const renderBackground = () => {
    switch (data.video.type) {
      case 'youtube': {
        const videoId = data.video.src.split('/').pop();
        return (
          <iframe
            src={`${data.video.src}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '56.25vw',   /* 16:9 basado en ancho */
              minHeight: '100vh',
              minWidth: '177.78vh', /* 16:9 basado en alto — cubre móvil vertical */
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              border: 'none',
            }}
          />
        );
      }
      case 'vimeo':
        return (
          <iframe
            src={`${data.video.src}?autoplay=1&loop=1&background=1&muted=1`}
            allow="autoplay; fullscreen"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.78vh',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              border: 'none',
            }}
          />
        );
      case 'local':
      default:
        return (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlayThrough={() => setVideoReady(true)}
            className="w-full h-full object-cover"
            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
          >
            <source src={data.video.src} type="video/mp4" />
          </video>
        );
    }
  };

  return (
    <>
      {/* ── Curtain loader ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="loader"
            variants={wrapVariants}
            exit="exit"
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {/* Top half */}
            <motion.div
              variants={topVariants}
              className="absolute inset-x-0 top-0 h-1/2 bg-purple-800"
            />
            {/* Bottom half */}
            <motion.div
              variants={bottomVariants}
              className="absolute inset-x-0 bottom-0 h-1/2 bg-purple-800"
            />
            {/* Centered bike icon */}
            <motion.div
              variants={iconVariants}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            >
              <motion.div
                animate={{ x: [-12, 12, -12] }}
                transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut' }}
              >
                <Bike size={64} className="text-white drop-shadow-lg" />
              </motion.div>
              <p className="text-white text-xs uppercase tracking-[0.35em] opacity-60">Cargando...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero section ───────────────────────────────────────────────────── */}
      <section id="home" className="relative w-full overflow-hidden flex items-center justify-center pt-20" style={{ height: '100dvh' }}>
        <div className="absolute inset-0 z-0" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="relative w-full h-full overflow-hidden">
            {renderBackground()}
          </div>
        </div>

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
            <img src={data.logo} alt="Logo" className="w-48 md:w-80 mb-3" />
            <p className="font-indie-flower italic text-xl md:text-3xl text-center px-4">
              {data.slogan.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  <span style={{ color: i % 2 === 1 ? '#96e0bf' : 'white' }}>{word}</span>
                  {i < data.slogan.split(' ').length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
