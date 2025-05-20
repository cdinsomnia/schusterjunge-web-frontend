import { FaYoutube, FaInstagram, FaSoundcloud, FaSpotify } from "react-icons/fa";
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-zinc-800 bg-black text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">

        <div>
          <p className="text-sm">
            © {new Date().getFullYear()} Schusterjunge. Präsident von Berlin.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 md:flex-col md:items-end md:space-y-4 md:space-x-0">

          <div className="flex space-x-6">
            <Link to="/imprint" className="text-sm hover:underline">Impressum</Link>
            <Link to="/privacy" className="text-sm hover:underline">Datenschutz</Link>
          </div>

          <div className="flex space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-white transition-colors">
              <FaYoutube />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-white transition-colors">
              <FaInstagram />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-white transition-colors">
              <FaSoundcloud />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-white transition-colors">
              <FaSpotify />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}