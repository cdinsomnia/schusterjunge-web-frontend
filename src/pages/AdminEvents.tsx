import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent } from '../lib/events';
import { Event } from '../lib/types';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { Skeleton } from '../components/ui/skeleton';

type FilterType = 'all' | 'upcoming' | 'past';

function isEventPast(date: string): boolean {
  return new Date(date) < new Date();
}

export function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
      } catch (error: any) {
        if (error instanceof Response && error.status === 302) {
          return;
        }
        setError('Error loading events.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  const handleDelete = async (eventId: string): Promise<void> => {
    if (!window.confirm('Bist du sicher, dass du diese Veranstaltung löschen möchtest?')) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setEvents(events.filter((event: Event) => event.id !== eventId));
    } catch (error: any) {
      if (error instanceof Response && error.status === 302) {
        return;
      }
      const errorMessage = (error instanceof Error ? error.message : 'Unknown error deleting event.');
      setError(`Error deleting event: ${errorMessage}`);
    }
  };

  if (isLoading && events.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-32 px-6 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-900/20 backdrop-blur-xl rounded-xl p-6 border border-zinc-800/50">
                <Skeleton className="h-8 w-1/3 mb-3" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-32 px-6 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-600/20 text-red-400 p-6 rounded-xl border border-red-500/20">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 px-6 sm:px-8 lg:px-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-5 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-blue-900/20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-dela text-3xl bg-gradient-to-r from-white via-zinc-300 to-zinc-400 bg-clip-text text-transparent"
          >
            Events verwalten
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/admin/events/new"
              className="inline-flex items-center space-x-3 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/60 text-white px-6 py-3 rounded-xl transition-all duration-200 relative group"
            >
              <FaPlus className="relative z-10" />
              <span className="relative z-10">Neues Event</span>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-4 mb-8"
        >
          {(['all', 'upcoming', 'past'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilter(filter)}
              className={`px-6 py-3 rounded-xl transition-all duration-200 relative group ${
                activeFilter === filter
                  ? 'bg-zinc-900/60 text-white'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <span className="relative z-10">
                {filter === 'all' ? 'Alle' : filter === 'upcoming' ? 'Kommend' : 'Vergangen'}
              </span>
            </button>
          ))}
        </motion.div>

        <div className="grid gap-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/20 backdrop-blur-xl rounded-xl p-8 border border-zinc-800/50 hover:border-blue-500/20 transition-all duration-200 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/5 rounded-xl transition-all duration-200" />
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-3">
                  <h3 className="text-2xl font-medium text-white">{event.title}</h3>
                  <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>{new Date(event.date).toLocaleDateString('de-DE')}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center space-x-3">
                        <FaBuilding className="text-blue-500" />
                        <span>{event.venue}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center space-x-3">
                        <FaMapMarkerAlt className="text-blue-500" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Link
                    to={`/admin/events/${event.id}`}
                    className="p-3 text-zinc-400 hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-zinc-900/40"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-3 text-zinc-400 hover:text-red-500 transition-colors duration-200 rounded-lg hover:bg-zinc-900/40"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}