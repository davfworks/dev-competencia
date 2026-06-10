import React, { useState, useEffect } from 'react';
import { Bike, Camera, Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Competencia', href: '#competition' },
    { name: 'Detalles', href: '#details' },
    { name: 'Artículos', href: '#articles' },
    { name: 'Inscripciones', href: '#registration' },
    { name: 'Sponsors', href: '#sponsors' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-[60] transition-colors duration-300 px-6 py-4',
          isScrolled ? 'bg-brand/95 backdrop-blur-md shadow-lg' : 'bg-black/30'
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Left — icons */}
          <div className="hidden md:flex items-center gap-5">
            <a href="#registration" aria-label="Inscripciones" className="text-white hover:text-accent transition-colors">
              <Bike size={30} />
            </a>
            <a href="#articles" aria-label="Fotografías" className="text-white hover:text-accent transition-colors">
              <Camera size={26} />
            </a>
          </div>

          {/* Right — nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white hover:text-accent transition-colors font-medium text-xs uppercase tracking-widest"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay — fuera del nav para evitar stacking context */}
      <div
        className={cn(
          'fixed inset-0 z-[70] md:hidden flex flex-col items-center justify-center space-y-8 transition-transform duration-500',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ backgroundColor: 'var(--color-brand)' }}
      >
        <button
          className="absolute top-6 left-6 text-white"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Cerrar menú"
        >
          <X size={32} />
        </button>
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-white text-2xl font-black uppercase tracking-[0.2em] hover:text-accent transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </a>
        ))}
      </div>
    </>
  );
};

export default Navbar;
