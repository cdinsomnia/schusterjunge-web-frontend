// frontend/src/pages/Login.tsx

import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAction, isAuthenticated } from '../lib/auth';
import { LoginActionResult } from '../lib/types';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login Component useEffect: Checking authentication status...');
    if (isAuthenticated()) {
       console.log('Login Component useEffect: Already authenticated, redirecting to /admin/events.');
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
        console.log('Login successful in component, redirecting.');
        navigate('/admin/events', { replace: true });

      } else {
        setError(result.error || 'Login failed.');
        setIsLoggingIn(false);
      }

    } catch (error: any) {
      console.error('Unexpected error during login:', error);
      setError('An unexpected error occurred.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 flex items-center justify-center"> {/* Passe deine Layout-Klassen an */}
      <div className="max-w-md w-full bg-zinc-900/20 p-8 rounded-xl shadow-lg">
        <h1 className="font-[Dela_Gothic_One] text-3xl text-center text-white mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-1">
              Benutzername
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
              Passwort
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-600/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Anmelden..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export { Login };