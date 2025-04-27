import { useState } from 'react';
import { X } from 'lucide-react';
import { CgMenuRight } from "react-icons/cg";
import { Link } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed w-full top-0 z-50 bg-gradient-to-b from-black/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link to="/" className="text-xl uppercase font-semibold hover-underline text-white">
              Schusterjunge
            </Link>
          </div>

          {/* Menu button for all devices */}
          <div className="flex items-center -mx-2 text-white">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:text-white/50 transition-colors items-center"
            >
              {isMenuOpen ? <X size={24} className="text-white" /> : <CgMenuRight size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {isMenuOpen && (
        <div className="w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/70 backdrop-blur-sm">
            <Link to="/#media" className="block px-3 py-2 text-white hover:bg-zinc-900/40 rounded-md">Für Veranstalter</Link>
            <Link to="/#link" className="block px-3 py-2 text-white hover:bg-zinc-900/40 rounded-md">Meine Links</Link>
            <Link to="/events" className="block px-3 py-2 text-white hover:bg-zinc-900/40 rounded-md">Veranstaltungen</Link>
          </div>
        </div>
      )}
    </nav>
  );
} 