// frontend/src/types.ts

export interface Event {
  id: number;
  title: string;
  date: string;
  description: string | null;
  venue: string | null;
  location: string | null;
  imageUrl: string | null;
  ticketUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type EventFormData = Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'venue' | 'location' | 'imageUrl' | 'ticketUrl'> & {
  id?: number;
  title: string;
  date: string;
  description?: string | null;
  venue?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  ticketUrl?: string | null;
};

// Auth
export interface LoginCredentials {
  username?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
}

export interface TokenPayload {
  userId: number;
}

export interface LoginActionResult {
  success?: boolean;
  error?: string;
}

export interface BackendErrorMessage {
    message: string;
}