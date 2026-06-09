import React from 'react';
import type { FooterData, SocialData, ContactData } from '../types';
import footerData from '../data/footer.json';
import socialData from '../data/social.json';
import contactData from '../data/contact.json';
import { Bike, Camera, Users, Play, Music2, Mail, Phone, MessageCircle } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  instagram: <Camera size={20} />,
  facebook: <Users size={20} />,
  youtube: <Play size={20} />,
  tiktok: <Music2 size={20} />,
};

const Footer: React.FC = () => {
  const footer = footerData as FooterData;
  const social = socialData as SocialData;
  const contact = contactData as ContactData;

  const whatsappNumber = footer.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <footer id="contact" className="bg-brand text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        {/* Column 1 — Identity */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Bike size={28} className="text-brand" />
            <span className="text-xl font-black italic tracking-tighter">{footer.name}</span>
          </div>
          <p className="text-zinc-500 text-sm mb-1 uppercase tracking-widest">{footer.edition}</p>
          <p className="text-zinc-400 leading-relaxed mt-4">{footer.slogan}</p>
        </div>

        {/* Column 2 — Contact */}
        <div>
          <h4 className="text-sm font-bold uppercase italic mb-6 border-b border-brand pb-2 inline-block tracking-widest">
            {contact.title}
          </h4>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 text-zinc-400">
              <Mail size={18} className="text-brand shrink-0" />
              <span>{contact.email}</span>
            </li>
            <li className="flex items-center space-x-3 text-zinc-400">
              <Phone size={18} className="text-brand shrink-0" />
              <span>{contact.phone}</span>
            </li>
          </ul>
        </div>

        {/* Column 3 — Social */}
        <div>
          <h4 className="text-sm font-bold uppercase italic mb-6 border-b border-brand pb-2 inline-block tracking-widest">
            Redes Sociales
          </h4>
          <div className="flex flex-wrap gap-3">
            {social.links.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                aria-label={link.platform}
                className="w-10 h-10 bg-white/15 flex items-center justify-center hover:bg-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {iconMap[link.icon] ?? <span className="text-xs">{link.platform[0]}</span>}
              </a>
            ))}
          </div>
        </div>

        {/* Column 4 — WhatsApp */}
        <div>
          <h4 className="text-sm font-bold uppercase italic mb-6 border-b border-brand pb-2 inline-block tracking-widest">
            Contacto Directo
          </h4>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold uppercase px-6 py-3 transition-colors"
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>
          <p className="text-zinc-500 text-sm mt-4">{footer.whatsapp}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/20 text-center text-white/50 text-sm">
        <p>{footer.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
