import { useState, useEffect } from 'react';
import { getEvents } from '../lib/events';
import { Event } from '../lib/types';
// import { isAuthenticated } from '../lib/auth'; // Optional import

type FilterType = 'all' | 'upcoming' | 'past';

function isEventPast(eventDateString: string): boolean {
  const eventDate = new Date(eventDateString);
  const now = new Date();
  return eventDate < now;
}

type EventCardProps = {
  title: string;
  date: string;
  venue: string;
  location: string;
  image: string;
  ticketUrl?: string;
};

function EventCard({ title, date, venue, location, image, ticketUrl }: EventCardProps) {
  return (
    <div className="bg-black/40 rounded-lg overflow-hidden hover:bg-black/70 transition-all">
      <div className="h-48 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {ticketUrl && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Tickets</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-zinc-400">{date}</p>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-zinc-300">{venue} · {location}</p>
          </div>
          {ticketUrl && (
            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              Tickets kaufen
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

type PastEventItemProps = {
  title: string;
  venue: string;
  location: string;
};

function PastEventItem({ title, venue, location }: PastEventItemProps) {
  return (
    <div className="bg-black/40 p-3 rounded hover:bg-black/70 transition-all">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-zinc-400">{venue} · {location}</p>
    </div>
  );
}


export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedEvents: Event[] = await getEvents();
        setEvents(fetchedEvents);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching public events:', error);
        setError('Fehler beim Laden der Events.');
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(event => !isEventPast(event.date));
  const pastEvents = events.filter(event => isEventPast(event.date));

  if (isLoading && events.length === 0) {
    return <div className="text-white">Lade Events...</div>;
  }

  if (error) {
    return <div className="text-red-500">Fehler beim Laden der Events: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="flex justify-between items-center mb-12">
          <h1 className="font-[Dela_Gothic_One] text-5xl text-center text-white">Veranstaltungen</h1>
        </div>

        <div className="mb-12">
            <h2 className="font-[Dela_Gothic_One] text-2xl text-white mb-4">Kommende Veranstaltungen</h2>
            {upcomingEvents.length === 0 && !isLoading && !error ? (
                <div className="text-zinc-400">Keine kommenden Events gefunden.</div>
            ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event: Event) => (
                         <EventCard
                            key={event.id}
                            title={event.title}
                            date={new Date(event.date).toLocaleDateString('de-DE')}
                            venue={event.venue || ''}
                            location={event.location || ''}
                            image={event.imageUrl || '/events/fallback.png'}
                            ticketUrl={event.ticketUrl || undefined}
                         />
                    ))}
                 </div>
            )}
        </div>

         <div>
            <h2 className="font-[Dela_Gothic_One] text-2xl text-white mb-4">Vergangene Veranstaltungen</h2>
            {pastEvents.length === 0 && !isLoading && !error ? (
                <div className="text-zinc-400">Keine vergangenen Events gefunden.</div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-4">
                    {pastEvents.map((event: Event) => (
                         <PastEventItem
                           key={event.id}
                           title={event.title}
                           venue={event.venue || ''}
                           location={event.location || ''}
                         />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}