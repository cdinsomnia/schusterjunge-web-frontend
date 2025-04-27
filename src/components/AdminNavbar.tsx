// frontend/src/components/AdminNavbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { signout } from '../lib/auth';

export function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signout();
    console.log('Logout successfull, redirecting to login page.');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="bg-zinc-900 py-2 px-4 mt-24"> 
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-green-500 font-medium">Admin-Bereich</span>
          <Link to="/admin/events" className="text-zinc-300 hover:text-white">
            Events
          </Link>
        </div>
        <button
          onClick={handleLogout} 
          className="text-zinc-400 hover:text-white"
        >
          Ausloggen
        </button>
      </div>
    </div>
  );
}
