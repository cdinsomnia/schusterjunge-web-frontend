// frontend/src/lib/events.ts

import { redirect } from 'react-router-dom';
import { Event, EventFormData, BackendErrorMessage } from '../lib/types';
import { getToken } from './auth';

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

export async function handleUnauthorized(response: Response): Promise<Response> {
  if (response.status === 401) {
    console.warn('Events: Unauthorized. Throwing redirect.');
    throw redirect('/admin/login');
  }
  return response;
}

export async function getEvents(): Promise<Event[]> {
  const endpoint = `${API_BASE_URL}/events`;
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Events: Failed to fetch public events', response.status);
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    const events: Event[] = await response.json();
    return events;
  } catch (error) {
    console.error('Events: Error in getEvents', error);
    throw error;
  }
}

export async function getEvent(id: number | string): Promise<Event | null> {
  const token = getToken();
  if (!token) {
    console.warn('Events: No token, redirecting for getEvent.');
    throw redirect('/admin/login');
  }

  const endpoint = `${API_BASE_URL}/events/${id}`;
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    const authCheckedResponse = await handleUnauthorized(response);

    if (!authCheckedResponse.ok) {
      console.error(`Events: Failed to fetch event ${id}`, authCheckedResponse.status);
      if (authCheckedResponse.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch event: ${authCheckedResponse.statusText}`);
    }

    const event: Event = await authCheckedResponse.json();
    return event;

  } catch (error) {
    console.error(`Events: Error in getEvent ${id}`, error);
    throw error;
  }
}

export async function createEvent(eventData: EventFormData): Promise<Event> {
  const token = getToken();
  if (!token) {
    console.warn('Events: No token, redirecting for createEvent.');
    throw redirect('/admin/login');
  }
  const endpoint = `${API_BASE_URL}/events`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData),
    });

    const authCheckedResponse = await handleUnauthorized(response);

    if (!authCheckedResponse.ok) {
      console.error('Events: Failed to create event', authCheckedResponse.status);
      throw new Error(`Failed to create event: ${authCheckedResponse.statusText}`);
    }

    const createdEvent: Event = await authCheckedResponse.json();
    console.log('Events: Event created.');
    return createdEvent;

  } catch (error) {
    console.error('Events: Error in createEvent', error);
    throw error;
  }
}

export async function updateEvent(id: number | string, updates: Partial<EventFormData>): Promise<Event> {
  const token = getToken();
  if (!token) {
    console.warn('Events: No token, redirecting for updateEvent.');
    throw redirect('/admin/login');
  }
  const endpoint = `${API_BASE_URL}/events/${id}`;
  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates),
    });

    const authCheckedResponse = await handleUnauthorized(response);

    if (!authCheckedResponse.ok) {
      console.error(`Events: Failed to update event ${id}`, authCheckedResponse.status);
      throw new Error(`Failed to update event: ${authCheckedResponse.statusText}`);
    }

    const updatedEvent: Event = await authCheckedResponse.json();
    console.log('EventsLib: Event updated.');
    return updatedEvent;

  } catch (error) {
    console.error(`Events: Error in updateEvent ${id}`, error);
    throw error;
  }
}

export async function deleteEvent(id: number | string): Promise<{ success: true, status: number }> {
  const token = getToken();
  if (!token) {
    console.warn('Events: No token, redirecting for deleteEvent.');
    throw redirect('/admin/login');
  }
  const endpoint = `${API_BASE_URL}/events/${id}`;
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    const authCheckedResponse = await handleUnauthorized(response);

    if (!authCheckedResponse.ok) {
      console.error(`Events: Failed to delete event ${id}`, authCheckedResponse.status);
      throw new Error(`Failed to delete event: ${authCheckedResponse.statusText}`);
    }

    if (authCheckedResponse.status === 204) {
      console.log(`Events: Event ${id} deleted (204 No Content).`);
      return { success: true, status: 204 };
    }

    console.log(`Events: Event ${id} deleted (Status ${authCheckedResponse.status}).`);
    return { success: true, status: authCheckedResponse.status };

  } catch (error) {
    console.error(`Events: Error in deleteEvent ${id}`, error);
    throw error;
  }
}