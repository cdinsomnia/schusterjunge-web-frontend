import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getEvents, deleteEvent } from '../lib/events';
import { Event } from '../lib/types';

type FilterType = 'all' | 'upcoming' | 'past';

function isEventPast(eventDateString: string): boolean {
  const eventDate = new Date(eventDateString);
  const now = new Date();
  return eventDate < now;
}

export function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedEvents: Event[] = await getEvents();
        setEvents(fetchedEvents);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching admin events:', error);
        if (error instanceof Response && error.status === 302) {
          navigate('/admin/login');
        } else {
          setError('Error loading events.');
          setIsLoading(false);
        }
      }
    }
    fetchEvents();
  }, [navigate]);

   useEffect(() => {
       if (activeFilter === 'all') {
           setFilteredEvents(events);
       } else {
           const filtered = events.filter((event: Event) => {
               const past = isEventPast(event.date);
               return activeFilter === 'upcoming' ? !past : past;
           });
            setFilteredEvents(filtered);
       }
   }, [events, activeFilter]);

  const handleFilter = (filterType: FilterType) => {
    setActiveFilter(filterType);
  };

  const handleDelete = async (eventId: number): Promise<void> => {
    console.log(`Attempting to delete event with ID: ${eventId}`);
    if (!window.confirm('Bist du sicher, dass du diese Veranstaltung löschen möchtest?')) {
        return;
    }

    try {
      await deleteEvent(eventId);
      console.log(`Event ${eventId} successfully deleted.`);
      setEvents(events.filter((event: Event) => event.id !== eventId));
    } catch (error: any) {
      console.error(`Error deleting event ${eventId}:`, error);
      if (error instanceof Response && error.status === 302) {
        navigate('/admin/login');
      } else {
        const errorMessage = (error instanceof Error ? error.message : 'Unknown error deleting event.');
        setError(`Error deleting event: ${errorMessage}`);
      }
    }
  };

  if (isLoading && events.length === 0) {
    return <div className="text-white">Lade Veranstaltungen...</div>;
  }

  if (error) {
    return <div className="text-red-500">Fehler beim Laden der Veranstaltungen: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* <AdminNavbar /> */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="font-[Dela_Gothic_One] text-3xl text-white">Admin Veranstaltungen</h1>
          <Link to="/admin/events/new" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
            Neues Event
          </Link>
        </div>

        <div className="mb-6">
          <div className="border-b border-zinc-700">
            <nav className="-mb-px flex">
              <button
                onClick={() => handleFilter('all')}
                className={`border-b-2 py-2 px-4 font-medium ${activeFilter === 'all' ? 'border-green-500 text-green-500' : 'border-transparent text-zinc-400 hover:text-zinc-300'}`}
              >
                Alle Events ({events.length})
              </button>
              <button
                onClick={() => handleFilter('upcoming')}
                className={`border-b-2 py-2 px-4 font-medium ${activeFilter === 'upcoming' ? 'border-green-500 text-green-500' : 'border-transparent text-zinc-400 hover:text-zinc-300'}`}
              >
                Kommende ({events.filter((e: Event) => !isEventPast(e.date)).length})
              </button>
              <button
                onClick={() => handleFilter('past')}
                className={`border-b-2 py-2 px-4 font-medium ${activeFilter === 'past' ? 'border-green-500 text-green-500' : 'border-transparent text-zinc-400 hover:text-zinc-300'}`}
              >
                Vergangen ({events.filter((e: Event) => isEventPast(e.date)).length}) 
              </button>
            </nav>
          </div>
        </div>

        {!isLoading && !error && ( 
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
             <table className="min-w-full divide-y divide-zinc-800">
                 <thead className="bg-zinc-900/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-24"> Datum </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-1/4"> Name </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-1/5"> Veranstaltungsort </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-1/5"> Ort </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-24"> Status </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-32"> Tickets </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider"> Aktionen </th>
                    </tr>
                </thead>
                <tbody className="bg-black divide-y divide-zinc-800">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event: Event) => ( 
                      <tr key={event.id} className="hover:bg-zinc-900/20">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                           {new Date(event.date).toLocaleDateString('de-DE')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {event.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                          {event.venue || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                          {event.location || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isEventPast(event.date) ? 'bg-zinc-600 text-zinc-200' : 'bg-green-600/30 text-green-400'}`}>
                            {isEventPast(event.date) ? 'Vergangen' : 'Anstehend'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                          {event.ticketUrl ? (
                            <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                              Ticket-Link
                            </a>
                          ) : (
                            <span className="text-zinc-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/admin/events/edit/${event.id}`} className="text-indigo-400 hover:text-indigo-300 mr-4">
                            Bearbeiten
                          </Link>
                          <button
                            onClick={() => { if (window.confirm('Bist du sicher, dass diese Veranstaltung löschen möchtest?')) handleDelete(event.id); }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Löschen
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">
                        Keine Events gefunden für diesen Filter.
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}