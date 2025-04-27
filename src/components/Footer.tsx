import { FaYoutube, FaInstagram, FaSoundcloud, FaSpotify } from "react-icons/fa";
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Schusterjunge. Präsident von Berlin.
        </p>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/impressum" className="text-sm text-gray-400 hover-underline">Impressum</Link>
            <Link to="/datenschutz" className="text-sm text-gray-400 hover-underline">Datenschutz</Link>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0 text-gray-400">
            <a href="#" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaSoundcloud /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaSpotify /></a>
          </div>
        </div>
      </div>
    </footer>
  );
} 