// frontend/src/pages/Login.tsx

import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginAction, isAuthenticated } from '../lib/auth';
import { LoginActionResult } from '../lib/types';
import { motion } from 'framer-motion';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/events', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    const credentials = { username, password };

    try {
      const result: LoginActionResult = await loginAction(credentials);
      if (result.success) {
        const from = location.state?.from?.pathname || '/admin/events';
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login fehlgeschlagen.');
        setIsLoggingIn(false);
      }
    } catch (error: any) {
      setError('Ein unerwarteter Fehler ist aufgetreten.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-blue-900/30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4 bg-zinc-900/30 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-zinc-800/50 relative z-10"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-30" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-dela text-4xl text-center mb-10 bg-gradient-to-r from-white via-zinc-300 to-zinc-400 bg-clip-text text-transparent"
        >
          Admin Login
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
              Benutzername
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Passwort
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
            />
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-600/20 text-red-400 text-sm border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            type="submit"
            className="w-full bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/60 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative group"
            disabled={isLoggingIn}
          >
            <span className="relative z-10">{isLoggingIn ? "Anmelden..." : "Login"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/5 rounded-lg transition-opacity duration-200" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}