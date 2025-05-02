// src/components/Header.tsx

import { X } from 'lucide-react';
import { CgMenuRight } from "react-icons/cg";
import { Link, useLocation } from 'react-router-dom';
import { useMenuStore } from '../store/menuStore';
import { useMediaQuery } from '../hooks/use-media-query';

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export function Header() {
  const isMenuOpen = useMenuStore((state) => state.isMenuOpen);
  const toggleMenu = useMenuStore((state) => state.toggleMenu);
  const closeMenu = () => useMenuStore.getState().closeMenu();

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const headerClasses = `fixed w-full top-0 z-50 transition-colors duration-300 ${
    isHomePage ? 'bg-transparent' : 'bg-black shadow-md'
  }`;

  return (
    <nav className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="shrink-0">
            <Link to="/" className="p-2 text-xl uppercase font-semibold text-white">
              Schusterjunge
            </Link>
          </div>

          {/* Menu button for all devices */}
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover-bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <CgMenuRight size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}

      {!isDesktop && isMenuOpen && (
        <div className="w-full bg-black/90 backdrop-blur-sm py-2">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/#media" className="block px-3 py-2 text-white hover-bg-zinc-700 rounded-md" onClick={closeMenu}>Für Veranstalter</Link>
            <Link to="/#link" className="block px-3 py-2 text-white hover-bg-zinc-700 rounded-md" onClick={closeMenu}>Meine Links</Link>
            <Link to="/events" className="block px-3 py-2 text-white hover-bg-zinc-700 rounded-md" onClick={closeMenu}>Veranstaltungen</Link>
          </div>
        </div>
      )}

      {isDesktop && (
        <Dialog open={isMenuOpen} onOpenChange={(open) => !open && closeMenu()}>
          <DialogContent className="bg-black text-white border-zinc-700 p-8 max-w-md mx-auto rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="shrink-0">
                <Link to="/" className="text-xl uppercase font-semibold text-white" onClick={closeMenu}>
                  SCHUSTERJUNGE
                </Link>
              </div>
            </div>

            <div className="border-b border-zinc-700 mb-6"></div>

            <div className="flex flex-col space-y-6">
               <Link to="/#media" className="text-3xl font-semibold" onClick={closeMenu}>Für Veranstalter</Link>
               <Link to="/#link" className="text-3xl font-semibold" onClick={closeMenu}>Meine Links</Link>
               <Link to="/events" className="text-3xl font-semibold" onClick={closeMenu}>Veranstaltungen</Link>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </nav>
  );
}