import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../lib/events';
import { Event } from '../lib/types';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaBuilding, FaTicketAlt } from 'react-icons/fa';
import { EventsLoading } from '../components/EventsLoading';

type FilterType = 'all' | 'upcoming' | 'past';

function isEventPast(date: string): boolean {
  return new Date(date) < new Date();
}

export function Events() {
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
        setFilteredEvents(fetchedEvents);
      } catch (error: any) {
        console.error('Error fetching events:', error);
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

  if (isLoading) {
    return <EventsLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black/50 to-black pt-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-600/20 text-red-400 p-6 rounded-xl border border-red-500/20 backdrop-blur-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black/50 to-black py-24 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-5 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-blue-900/10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-dela text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent leading-tight">
            Veranstaltungen
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto px-4">
            Entdecke unsere kommenden Shows und Events. Wir freuen uns darauf, dich live zu sehen!
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 px-4"
        >
          {(['all', 'upcoming', 'past'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 relative group ${
                activeFilter === filter
                  ? 'bg-white/10 text-white backdrop-blur-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <span className="relative z-10 text-sm sm:text-base">
                {filter === 'all' ? 'Alle' : filter === 'upcoming' ? 'Kommend' : 'Vergangen'}
              </span>
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/20 transition-all duration-200 relative group flex flex-col"
            >
              {event.imageUrl && (
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-xl sm:text-2xl font-dela text-white mb-3 sm:mb-4 leading-tight">{event.title}</h3>
                
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start space-x-3">
                    <FaCalendarAlt className="text-blue-400/60 mt-1 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {new Date(event.date).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                        {event.endDate && (
                          <>
                            {' - '}
                            {new Date(event.endDate).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </>
                        )}
                      </span>
                      {event.startTime && (
                        <span className="text-white/60 text-sm mt-0.5">
                          {event.startTime.split(':').slice(0, 2).join(':')} Uhr
                        </span>
                      )}
                    </div>
                  </div>

                  {event.venue && (
                    <div className="flex items-start space-x-3">
                      <FaBuilding className="text-blue-400/60 mt-1 flex-shrink-0" />
                      <span>{event.venue}</span>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-start space-x-3">
                      <FaMapMarkerAlt className="text-blue-400/60 mt-1 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="mt-4 text-sm text-white/60 line-clamp-2 sm:line-clamp-3">{event.description}</p>
                )}

                {event.ticketUrl && (
                  <motion.a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 sm:mt-6 inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg transition-all duration-200 backdrop-blur-sm text-sm sm:text-base w-full sm:w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTicketAlt />
                    <span>Tickets</span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}