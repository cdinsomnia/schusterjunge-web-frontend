import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, createEvent, updateEvent } from '../lib/events';
import { EventFormData } from '../lib/types';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaBuilding, FaMapMarkerAlt, FaClock, FaInfoCircle } from 'react-icons/fa';

export function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    endDate: '',
    startTime: '',
    description: null,
    venue: null,
    location: null,
    imageUrl: null,
    ticketUrl: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function loadEvent() {
      if (!isEditMode || !id) {
        setInitialLoading(false);
        return;
      }

      try {
        const event = await getEvent(id);

        if (event) {
          setFormData(prev => ({
            ...prev,
            title: event.title,
            date: event.date ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(event.date)) : '',
            endDate: event.endDate ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(event.endDate)) : '',
            startTime: event.startTime ? new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(new Date(event.startTime)) : '',
            description: event.description,
            venue: event.venue,
            location: event.location,
            imageUrl: event.imageUrl,
            ticketUrl: event.ticketUrl,
          }));
          setIsLoading(false);
          setInitialLoading(false);
        } else {
          console.warn(`Event with ID ${id} not found.`);
          navigate('/admin/events');
          setIsLoading(false);
          setInitialLoading(false);
        }
      } catch (error: any) {
        console.error('Error loading event for edit:', error);
        if (error instanceof Response && error.status === 302) {
          navigate('/admin/login');
        } else {
          setLoadError('Error loading event data.');
          setIsLoading(false);
          setInitialLoading(false);
        }
      }
    }

    loadEvent();
  }, [id, isEditMode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'date' || name === 'endDate') {
      // Konvertiere das Datum in das deutsche Format
      const date = new Date(value);
      const formattedDate = date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      setFormData(prev => ({
        ...prev,
        [name]: formattedDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Konvertiere die Daten vom deutschen Format (DD.MM.YYYY) zu ISO-Format (YYYY-MM-DD)
    let dataToSend = { ...formData };
    if (dataToSend.date) {
      const [day, month, year] = dataToSend.date.split('.');
      dataToSend.date = `${year}-${month}-${day}`;
    }
    if (dataToSend.endDate) {
      const [day, month, year] = dataToSend.endDate.split('.');
      dataToSend.endDate = `${year}-${month}-${day}`;
    }

    try {
      let result;
      if (isEditMode && id) {
        result = await updateEvent(id, dataToSend);
        showMessage('Event erfolgreich aktualisiert', 'success');
        navigate('/admin/events');
      } else {
        result = await createEvent(dataToSend);
        showMessage('Event erfolgreich erstellt', 'success');
        if (!isEditMode) {
          setFormData({
            title: '', 
            date: '', 
            endDate: '',
            startTime: '',
            description: null, 
            venue: null, 
            location: null, 
            imageUrl: null, 
            ticketUrl: null
          });
        }
        navigate('/admin/events');
      }
    } catch (error: any) {
      console.error('Error saving event:', error);
      if (error instanceof Response && error.status === 302) {
        navigate('/admin/login');
      } else {
        const errorMessage = (error instanceof Error ? error.message : 'Unknown error saving.');
        showMessage(`Fehler beim Speichern des Events: ${errorMessage}`, 'error');
        setIsLoading(false);
      }
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  if (isEditMode && initialLoading) {
    return <div className="text-white">Event wird geladen...</div>;
  }

  if (isEditMode && loadError) {
    return <div className="text-red-500">Error Loading Event: {loadError}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          {id ? 'Event bearbeiten' : 'Neues Event erstellen'}
        </motion.h1>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-600/20 border border-green-600/40 text-green-400 p-4 rounded-lg mb-6"
          >
            {message.text}
          </motion.div>
        )}

        {loadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6"
          >
            {loadError}
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Titel
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Startdatum
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date ? new Date(formData.date.split('.').reverse().join('-')).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                />
                <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                Enddatum
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate ? new Date(formData.endDate.split('.').reverse().join('-')).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  min={formData.date ? new Date(formData.date.split('.').reverse().join('-')).toISOString().split('T')[0] : undefined}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                />
                <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium mb-2">
              Startzeit
            </label>
            <div className="relative">
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              />
              <FaClock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          <div>
            <label htmlFor="venue" className="block text-sm font-medium mb-2">
              Veranstaltungsort
            </label>
            <div className="relative">
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              />
              <FaBuilding className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Adresse
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              />
              <FaMapMarkerAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Beschreibung
            </label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              />
              <FaInfoCircle className="absolute right-4 top-4 text-zinc-500" />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
              Bild-URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="ticketUrl" className="block text-sm font-medium mb-2">
              Ticket-URL
            </label>
            <input
              type="url"
              id="ticketUrl"
              name="ticketUrl"
              value={formData.ticketUrl || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/events')}
              className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-zinc-800/50 transition-all duration-200"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all duration-200"
            >
              {isLoading ? 'Wird gespeichert...' : 'Speichern'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default { EventForm };