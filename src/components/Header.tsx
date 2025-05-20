import { X } from 'lucide-react';
import { CgMenuRight } from "react-icons/cg";
import { Link, useLocation } from 'react-router-dom';
import { useMenuStore } from '../store/menuStore';

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

  const headerClasses = `fixed w-full top-0 z-50 transition-all duration-300 ${
    isHomePage 
      ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg' 
      : 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
  }`;

  return (
    <nav className={headerClasses}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link 
              to="/" 
              className="p-2 text-xl uppercase font-semibold text-white hover:text-white/70 cursor-pointer transition-colors duration-200"
            >
              Schusterjunge
            </Link>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <CgMenuRight size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <Dialog open={isMenuOpen} onOpenChange={(open) => !open && closeMenu()}>
          <DialogContent className="bg-black/40 backdrop-blur-xl text-white border-white/10 p-12 max-w-md mx-auto rounded-xl shadow-2xl">
            <div className="space-y-8">
              <div>
                <Link 
                  to="/" 
                  className="block text-2xl md:text-3xl font-semibold text-white hover:text-white/80 transition-colors duration-200" 
                  onClick={closeMenu}
                >
                  <div className="px-4">
                    Wohin soll's gehen?
                  </div>
                </Link>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/events" 
                  className="group block text-xl font-medium text-white/90 hover:text-white transition-all duration-200" 
                  onClick={closeMenu}
                >
                  <div className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors duration-200">
                    Veranstaltungen
                  </div>
                </Link>
                <Link 
                  to="/kit" 
                  className="group block text-xl font-medium text-white/90 hover:text-white transition-all duration-200" 
                  onClick={closeMenu}
                >
                  <div className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors duration-200">
                    Presse-Kit für Veranstalter
                  </div>
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </nav>
  );
}