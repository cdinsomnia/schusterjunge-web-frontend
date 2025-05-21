// src/lib/events.ts

import { redirect } from 'react-router-dom';
import { Event, EventFormData } from '../lib/types';
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
    console.error(`Events: API_BASE_URL not defined for mode: ${import.meta.env.VITE_APP_MODE || 'undefined'}. Check .env file.`);
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
  console.log(`Events: Fetching public events from ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
       method: 'GET',
       headers: { },
    });

     if (!response.ok) {
         console.error('Events: Failed to fetch public events', response.status, response.statusText);
         let errorBody = '';
         try { errorBody = await response.text(); } catch(e) {}
         throw new Error(`Failed to fetch events: ${response.status} ${response.statusText} - ${errorBody}`);
     }

    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    if (response.status === 204 || (contentLength === '0' && (!contentType || !contentType.includes('application/json')))) {
        console.log('Events: Received empty or 204 response for events. Returning [].');
        return [];
    }

    try {
        const events: Event[] = await response.json();
        console.log('Events: Fetched public events successfully.', events.length, 'items.');
        if (!Array.isArray(events)) {
             console.error('Events: Fetched data is not an array!', events);
             throw new Error('Invalid data format received from server.');
        }
        return events;
    } catch (jsonError: any) {
        console.error('Events: Error parsing JSON response for events:', jsonError);
         let responseBody = '';
         try { responseBody = await response.text(); } catch(e) {}
        throw new Error(`Failed to parse events JSON: ${jsonError.message} - Response body: "${responseBody}"`);
    }


  } catch (error: any) {
     console.error('Events: Catching error in getEvents:', error);
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
    console.log(`Events: Fetching event ${id} from ${endpoint}`);
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
            console.error(`Events: Failed to fetch event ${id}`, authCheckedResponse.status, authCheckedResponse.statusText);
            let errorBody = '';
            try { errorBody = await authCheckedResponse.text(); } catch(e) {}
            if (authCheckedResponse.status === 404) {
                console.log(`Events: Event ${id} not found (404).`);
                return null;
            }
            throw new Error(`Failed to fetch event: ${authCheckedResponse.status} ${authCheckedResponse.statusText} - ${errorBody}`);
        }

        try {
            const event: Event = await authCheckedResponse.json();
            console.log(`Events: Fetched event ${id} successfully.`, event);
            return event;
        } catch (jsonError: any) {
            console.error(`Events: Error parsing JSON response for event ${id}:`, jsonError);
            let responseBody = '';
            try { responseBody = await authCheckedResponse.text(); } catch(e) {}
            throw new Error(`Failed to parse event JSON: ${jsonError.message} - Response body: "${responseBody}"`);
        }
    } catch (error: any) {
        console.error(`Events: Catching error in getEvent ${id}:`, error);
        throw error;
    }
}

export async function createEvent(eventData: EventFormData): Promise<Event> {
    const token = getToken();
    if (!token) {
        console.warn('Events: No token, redirecting for createEvent.');
        throw redirect('/admin/login');
    }

    const dataToSend = {
        ...eventData,
        date: eventData.date || null,
        endDate: eventData.endDate || null,
        startTime: eventData.startTime || null,
    };

    const endpoint = `${API_BASE_URL}/events`;
    console.log(`Events: Creating event at ${endpoint}`);
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });

        const authCheckedResponse = await handleUnauthorized(response);

        if (!authCheckedResponse.ok) {
            console.error('Events: Failed to create event', authCheckedResponse.status, authCheckedResponse.statusText);
            let errorBody = '';
            try { errorBody = await authCheckedResponse.text(); } catch(e) {}
            throw new Error(`Failed to create event: ${authCheckedResponse.status} ${authCheckedResponse.statusText} - ${errorBody}`);
        }

        try {
            const createdEvent: Event = await authCheckedResponse.json();
            console.log('Events: Event created successfully.', createdEvent);
            return createdEvent;
        } catch (jsonError: any) {
            console.error('Events: Error parsing JSON response for createEvent:', jsonError);
            let responseBody = '';
            try { responseBody = await authCheckedResponse.text(); } catch(e) {}
            throw new Error(`Failed to parse createEvent JSON: ${jsonError.message} - Response body: "${responseBody}"`);
        }
    } catch (error: any) {
        console.error('Events: Catching error in createEvent:', error);
        throw error;
    }
}

export async function updateEvent(id: number | string, updates: Partial<EventFormData>): Promise<Event> {
    const token = getToken();
    if (!token) {
        console.warn('Events: No token, redirecting for updateEvent.');
        throw redirect('/admin/login');
    }

    const dataToSend = {
        ...updates,
        date: updates.date || null,
        endDate: updates.endDate || null,
        startTime: updates.startTime || null,
    };

    const endpoint = `${API_BASE_URL}/events/${id}`;
    console.log(`Events: Updating event ${id} at ${endpoint}`);
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });

        const authCheckedResponse = await handleUnauthorized(response);

        if (!authCheckedResponse.ok) {
            console.error(`Events: Failed to update event ${id}`, authCheckedResponse.status, authCheckedResponse.statusText);
            let errorBody = '';
            try { errorBody = await authCheckedResponse.text(); } catch(e) {}
            throw new Error(`Failed to update event: ${authCheckedResponse.status} ${authCheckedResponse.statusText} - ${errorBody}`);
        }

        try {
            const updatedEvent: Event = await authCheckedResponse.json();
            console.log(`Events: Event ${id} updated successfully.`, updatedEvent);
            return updatedEvent;
        } catch (jsonError: any) {
            console.error(`Events: Error parsing JSON response for updateEvent ${id}:`, jsonError);
            let responseBody = '';
            try { responseBody = await authCheckedResponse.text(); } catch(e) {}
            throw new Error(`Failed to parse updateEvent JSON: ${jsonError.message} - Response body: "${responseBody}"`);
        }
    } catch (error: any) {
        console.error(`Events: Catching error in updateEvent ${id}:`, error);
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
     console.log(`Events: Deleting event ${id} at ${endpoint}`);
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
             console.error(`Events: Failed to delete event ${id}`, authCheckedResponse.status, authCheckedResponse.statusText);
              let errorBody = '';
              try { errorBody = await authCheckedResponse.text(); } catch(e) {}
             throw new Error(`Failed to delete event: ${authCheckedResponse.status} ${authCheckedResponse.statusText} - ${errorBody}`);
        }

        if (authCheckedResponse.status === 204) {
             console.log(`Events: Event ${id} deleted (204 No Content).`);
            return { success: true, status: 204 };
        }

         console.log(`Events: Event ${id} deleted (Status ${authCheckedResponse.status}).`);
        return { success: true, status: authCheckedResponse.status };

    } catch (error: any) {
         console.error(`Events: Catching error in deleteEvent ${id}:`, error);
        throw error;
    }
}