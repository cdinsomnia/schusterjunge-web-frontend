// frontend/src/lib/auth.ts

import { redirect } from 'react-router-dom';
import { LoginCredentials, LoginResponse, LoginActionResult, BackendErrorMessage } from '../lib/types';

const API_BASE_URL = 'http://localhost:3001/api';
const TOKEN_STORAGE_KEY = 'jwtToken';

function storeToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function signout(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  console.log('User signed out.');
}

function isAuthenticated(): boolean {
  return getToken() !== null;
}

async function loginAction(credentials: LoginCredentials): Promise<LoginActionResult> {
  const { username, password } = credentials;

   if (!username || !password) {
       console.error('Frontend validation failed: Username or password missing.');
       return { error: 'Username and password are required.' };
   }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const result: LoginResponse | BackendErrorMessage = await response.json().catch(() => ({ message: 'Unknown response from server.' }));

    if (!response.ok) {
      const errorResult = result as BackendErrorMessage;
      console.error('Login failed:', response.status, response.statusText, errorResult.message);
      return { error: errorResult.message || 'Login failed.' };
    }

    const successResult = result as LoginResponse;
    console.log('Login successful!');
    storeToken(successResult.token);

    return { success: true };

  } catch (error: any) {
    console.error('Network or other error during login:', error);
     return { error: 'There was a problem connecting to the server.' };
  }
}

function requireAuth(): void {
  if (!isAuthenticated()) {
    console.log('Authentication required. Redirecting to login.');
    throw redirect('/admin/login');
  }
}

export { loginAction, isAuthenticated, signout, requireAuth, getToken };