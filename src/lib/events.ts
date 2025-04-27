// frontend/src/lib/events.ts
import { redirect } from 'react-router-dom';
import { Event, BackendErrorMessage, EventFormData } from '../lib/types';
import { getToken } from './auth';

const API_BASE_URL = 'http://localhost:3001/api';

function handleUnauthorized(status: number): void {
  if (status === 401) {
    console.error('Unauthorized (401). Token invalid or missing.');
    throw redirect('/login');
  }
}

export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);

    handleUnauthorized(response.status);

    if (!response.ok) {
      console.error('Error fetching events:', response.status, response.statusText);
      const errorBody: BackendErrorMessage = await response.json().catch(() => ({ message: 'Unknown error fetching events.' }));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody.message}`);
    }

    const events: Event[] = await response.json();
    return events;

  } catch (error: any) {
    console.error('Network or backend error fetching events:', error);
     if (error instanceof Response) throw error;
    throw new Error('Failed to fetch events.');
  }
}

export async function getEvent(id: number | string): Promise<Event | null> {
  const eventId = parseInt(id as string, 10);
  if (isNaN(eventId)) {
      console.error('Invalid event ID:', id);
      throw new Error('Invalid event ID provided.');
  }

  const events: Event[] = await getEvents();
  const event = events.find(event => event.id === eventId);

  return event ?? null;
}

export async function createEvent(eventData: EventFormData): Promise<Event> {
  const token = getToken();

  if (!token) {
     handleUnauthorized(401);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
          title: eventData.title,
          date: eventData.date,
          description: eventData.description,
          venue: eventData.venue,
          location: eventData.location,
          imageUrl: eventData.imageUrl,
          ticketUrl: eventData.ticketUrl,
      }),
    });

    handleUnauthorized(response.status);

    if (!response.ok) {
      console.error('Error creating event:', response.status, response.statusText);
       const errorBody: BackendErrorMessage = await response.json().catch(() => ({ message: 'Unknown error creating event.' }));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody.message}`);
    }

    const newEvent: Event = await response.json();
    console.log('Event created successfully:', newEvent);
    return newEvent;

  } catch (error: any) {
    console.error('Network or backend error creating event:', error);
     if (error instanceof Response) throw error;
    throw new Error('Failed to create event.');
  }
}

export async function updateEvent(id: number | string, updates: EventFormData): Promise<Event> { // Use EventFormData for updates
  const token = getToken();

  if (!token) {
    handleUnauthorized(401);
  }

   const eventId = parseInt(id as string, 10);
   if (isNaN(eventId)) {
       console.error('Invalid event ID for update:', id);
        throw new Error('Invalid event ID provided for update.');
   }

  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
          title: updates.title,
          date: updates.date,
          description: updates.description,
          venue: updates.venue,
          location: updates.location,
          imageUrl: updates.imageUrl,
          ticketUrl: updates.ticketUrl,
      }),
    });

    handleUnauthorized(response.status); // Handle 401 (throws redirect)

    if (!response.ok) {
      console.error('Error updating event:', response.status, response.statusText);
      const errorBody: BackendErrorMessage = await response.json().catch(() => ({ message: 'Unknown error updating event.' }));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody.message}`);
    }

    const updatedEvent: Event = await response.json(); // Type assertion for the response
    console.log(`Event ${id} updated successfully:`, updatedEvent);
    return updatedEvent;

  } catch (error: any) {
    console.error(`Network or backend error updating event ${id}:`, error);
     if (error instanceof Response) throw error; // Re-throw Redirect
    throw new Error('Failed to update event.');
  }
}

export async function deleteEvent(id: number | string): Promise<{ success: true, status: number }> {
  const token = getToken();

  if (!token) {
    handleUnauthorized(401);
  }

   const eventId = parseInt(id as string, 10);
   if (isNaN(eventId)) {
       console.error('Invalid event ID for delete:', id);
       throw new Error('Invalid event ID provided for delete.'); // Throw an error
   }

  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, { // Use numeric ID in URL
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    handleUnauthorized(response.status); 

    if (response.status !== 204) {
       console.error('Error deleting event:', response.status, response.statusText);
       const errorBody: BackendErrorMessage = await response.json().catch(() => ({ message: 'Unknown error deleting event.' }));
       throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody.message}`);
    }

    console.log(`Event ${id} deleted successfully (Status 204).`);
    return { success: true, status: response.status };

  } catch (error: any) {
    console.error(`Network or backend error deleting event ${id}:`, error);
     if (error instanceof Response) throw error;
    throw new Error('Failed to delete event.');
  }
}