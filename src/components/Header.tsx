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

  const headerClasses = `fixed w-full top-0 z-50 transition-colors duration-300 ${isHomePage ? 'bg-black/60 backdrop-blur-xs shadow-md' : 'bg-black shadow-md'}`;

  return (
    <nav className={headerClasses}>
      <div className="mx-auto px-4 sm:px-6 lg:px-5">
        <div className="flex items-center justify-between h-16">

          <div className="shrink-0">
            <Link to="/" className="p-2 text-xl uppercase font-semibold text-white hover:text-white/70 cursor-pointer">
              Schusterjunge
            </Link>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover-bg-white/20 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-white text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <CgMenuRight size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}

      {isMenuOpen && (
        <Dialog open={isMenuOpen} onOpenChange={(open) => !open && closeMenu()}>
          <DialogContent className="bg-black/20 backdrop-blur-sm text-white border-zinc-700 p-8 max-w-md mx-auto rounded-lg">
            <div className="flex items-center justify-between">
              <div className="shrink-0">
                <Link to="/" className="text-2xl md:text-2xl lg:text-4xl font-semibold text-white" onClick={closeMenu}>
                  Wohin soll's gehen?
                </Link>
              </div>
            </div>

            <div className="flex mt-2 flex-col space-y-6 text-white/90">
            <Link to="/events" className="text-xl md:text-2xl font-medium hover:underline" onClick={closeMenu}>Veranstaltungen</Link>
              <Link to="/kit" className="text-xl md:text-2xl hover:underline" onClick={closeMenu}>Presse-Kit für Veranstalter</Link>
              {/* <Link to="/#link" className="text-2xl font-medium hover:underline" onClick={closeMenu}>Meine Links</Link> */}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </nav>
  );
}