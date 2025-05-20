// frontend/src/components/AdminNavbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { signout } from '../lib/auth';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';

export function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/40 backdrop-blur-xl border-b border-zinc-800/50 py-5 px-6"
    > 
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-12">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-dela text-2xl bg-gradient-to-r from-white via-zinc-300 to-zinc-400 bg-clip-text text-transparent"
          >
            Admin-Bereich
          </motion.span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/admin/events" 
              className="flex items-center space-x-3 text-zinc-300 hover:text-white transition-colors duration-200 group relative px-4 py-2 rounded-lg bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/60"
            >
              <FaCalendarAlt className="text-blue-500 group-hover:text-blue-400 transition-colors duration-200 relative z-10" />
              <span className="relative z-10">Events</span>
            </Link>
          </motion.div>
        </div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleLogout} 
          className="flex items-center space-x-3 text-zinc-400 hover:text-white transition-colors duration-200 group relative px-4 py-2 rounded-lg bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/60"
        >
          <FaSignOutAlt className="group-hover:text-blue-400 transition-colors duration-200 relative z-10" />
          <span className="relative z-10">Ausloggen</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
