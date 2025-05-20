// frontend/src/lib/auth.ts

import { redirect } from 'react-router-dom';
import { LoginCredentials, LoginResponse, LoginActionResult, BackendErrorMessage } from '../lib/types';

let API_BASE_URL: string | undefined;

switch (import.meta.env.VITE_APP_MODE) {
  case 'vercel':
    API_BASE_URL = import.meta.env.VITE_API_URL_VERCEL;
    break;
  case 'production':
    API_BASE_URL = import.meta.env.VITE_API_URL_PROD;
    break;
  case 'dev':
  default:
    API_BASE_URL = import.meta.env.VITE_API_URL_DEV;
    break;
}

if (!API_BASE_URL) {
  console.error(`API_BASE_URL not defined for mode: ${import.meta.env.VITE_APP_MODE}. Check .env file.`);
  API_BASE_URL = 'http://localhost:3001/api';
}

const TOKEN_STORAGE_KEY = 'jwtToken';

function storeToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function signout(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  console.log('Auth: Signed out.');
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export async function loginAction(credentials: LoginCredentials): Promise<LoginActionResult> {
  const { username, password } = credentials;

  if (!username || !password) {
    return { error: 'Username and password are required.' };
  }

  const loginEndpoint = `${API_BASE_URL}/auth/login`;

  try {
    const response = await fetch(loginEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const result: LoginResponse | BackendErrorMessage = await response.json().catch(() => ({ message: 'Unknown response.' }));

    if (!response.ok) {
      const errorResult = result as BackendErrorMessage;
      console.error('Auth: Login failed', response.status, errorResult.message);
      return { error: errorResult.message || 'Login failed.' };
    }

    const successResult = result as LoginResponse;
    console.log('Auth: Login successful.');
    storeToken(successResult.token);

    return { success: true };

  } catch (error: any) {
    console.error('Auth: Login network error', error);
    return { error: 'Connection error.' };
  }
}

export function requireAuth(): void {
  if (!isAuthenticated()) {
    console.log('Auth: Auth required, redirecting.');
    throw redirect('/admin/login');
  }
}