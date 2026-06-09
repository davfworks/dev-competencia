import React, { useState, useEffect } from 'react';
import type { CountdownData } from '../types';
import countdownData from '../data/countdown.json';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Route } from 'lucide-react';

const Countdown: React.FC = () => {
  const data = countdownData as CountdownData;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(data.targetDate).getTime();
    const interval = setInterval(() => {
      const distance = target - Date.now();
      if (distance < 0) { clearInterval(interval); return; }
      setTimeLeft({
        days:    Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [data.targetDate]);

  const timeItems = [
    { label: 'Días',     value: timeLeft.days },
    { label: 'Horas',    value: timeLeft.hours },
    { label: 'Minutos',  value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

  return (
    <section className="bg-brand py-24 px-6 border-y border-white/10">
      <div className="max-w-7xl mx-auto">

        {/* ── Mobile layout ── */}
        <div className="flex flex-col items-center gap-8 md:hidden">
          {/* 1. Title */}
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight text-center">
            {data.title}
          </h2>

          {/* 2. CTA */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#registration"
            className="inline-block bg-accent text-white px-10 py-4 font-black tracking-[0.2em] uppercase shadow-xl"
          >
            {data.cta}
          </motion.a>

          {/* 3. Location | Date | Distance in one line */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <MapPin size={16} className="text-accent shrink-0" />
            <span className="text-white font-bold text-sm uppercase tracking-wide">{data.location}</span>
            <span className="text-white/40 font-light">|</span>
            <Calendar size={16} className="text-accent shrink-0" />
            <span className="text-white font-bold text-sm uppercase tracking-wide">{data.date}</span>
            <span className="text-white/40 font-light">|</span>
            <Route size={16} className="text-accent shrink-0" />
            <span className="text-white font-bold text-sm uppercase tracking-wide">{data.distance}</span>
          </div>

          {/* 4. Timer */}
          <div className="grid grid-cols-4 gap-2 w-full">
            {timeItems.map((item) => (
              <div key={item.label} className="bg-white/10 border border-white/20 p-3 flex flex-col items-center backdrop-blur-sm">
                <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-white/40 uppercase text-[9px] mt-1 font-bold tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop layout — 3 columns ── */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-12 md:items-center">

          {/* Col 1 — Location & Date stacked */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-accent shrink-0" />
              <p className="text-white font-black text-xl uppercase tracking-wide">{data.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-accent shrink-0" />
              <p className="text-white font-black text-xl uppercase tracking-wide">{data.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <Route size={24} className="text-accent shrink-0" />
              <p className="text-white font-black text-xl uppercase tracking-wide">{data.distance}</p>
            </div>
          </div>

          {/* Col 2 — Title & CTA */}
          <div className="flex flex-col items-start gap-8 -ml-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">
              {data.title}
            </h2>
            <motion.a
              whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#512286' }}
              whileTap={{ scale: 0.95 }}
              href="#registration"
              className="inline-block bg-accent text-white px-10 py-4 font-black tracking-[0.2em] uppercase transition-all shadow-xl"
            >
              {data.cta}
            </motion.a>
          </div>

          {/* Col 3 — Timer single row */}
          <div className="grid grid-cols-4 gap-2">
            {timeItems.map((item) => (
              <div key={item.label} className="bg-white/10 border border-white/20 p-4 flex flex-col items-center backdrop-blur-sm">
                <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-white/40 uppercase text-[10px] mt-2 font-bold tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Countdown;
