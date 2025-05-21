import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, createEvent, updateEvent } from '../lib/events';
import { EventFormData } from '../lib/types';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaBuilding, FaMapMarkerAlt, FaClock, FaInfoCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import { de } from 'date-fns/locale/de';

registerLocale('de', de);

export function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    endDate: null,
    startTime: null,
    description: null,
    venue: null,
    location: null,
    imageUrl: null,
    ticketUrl: null
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

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
            date: event.date,
            endDate: event.endDate,
            startTime: event.startTime,
            description: event.description,
            venue: event.venue,
            location: event.location,
            imageUrl: event.imageUrl,
            ticketUrl: event.ticketUrl,
          }));

          // Setze die Datepicker-Werte
          if (event.date) {
            const date = new Date(event.date);
            if (!isNaN(date.getTime())) {
              setSelectedDate(date);
            }
          }
          if (event.endDate) {
            const date = new Date(event.endDate);
            if (!isNaN(date.getTime())) {
              setSelectedEndDate(date);
            }
          }
          if (event.startTime) {
            const [hours, minutes] = event.startTime.split(':');
            const timeDate = new Date();
            timeDate.setHours(parseInt(hours), parseInt(minutes));
            if (!isNaN(timeDate.getTime())) {
              setSelectedTime(timeDate);
            }
          }

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null, isEndDate: boolean = false) => {
    if (date && !isNaN(date.getTime())) {
      if (isEndDate) {
        setSelectedEndDate(date);
        setFormData(prev => ({
          ...prev,
          endDate: date.toISOString().split('T')[0]
        }));
      } else {
        setSelectedDate(date);
        setFormData(prev => ({
          ...prev,
          date: date.toISOString().split('T')[0]
        }));
      }
    } else {
      if (isEndDate) {
        setSelectedEndDate(null);
        setFormData(prev => ({
          ...prev,
          endDate: null
        }));
      } else {
        setSelectedDate(null);
        setFormData(prev => ({
          ...prev,
          date: ''
        }));
      }
    }
  };

  const handleTimeChange = (time: Date | null) => {
    if (time && !isNaN(time.getTime())) {
      setSelectedTime(time);
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      setFormData(prev => ({
        ...prev,
        startTime: `${hours}:${minutes}`
      }));
    } else {
      setSelectedTime(null);
      setFormData(prev => ({
        ...prev,
        startTime: null
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Stelle sicher, dass alle Datumswerte gültig sind
      const dataToSend = { ...formData };
      
      if (dataToSend.date) {
        const date = new Date(dataToSend.date);
        if (!isNaN(date.getTime())) {
          dataToSend.date = date.toISOString().split('T')[0];
        }
      }
      
      if (dataToSend.endDate) {
        const date = new Date(dataToSend.endDate);
        if (!isNaN(date.getTime())) {
          dataToSend.endDate = date.toISOString().split('T')[0];
        }
      }

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
            endDate: null,
            startTime: null,
            description: null, 
            venue: null, 
            location: null, 
            imageUrl: null, 
            ticketUrl: null
          });
          setSelectedDate(null);
          setSelectedEndDate(null);
          setSelectedTime(null);
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
            className={`${
              message.type === 'success' 
                ? 'bg-green-600/20 border-green-600/40 text-green-400' 
                : 'bg-red-600/20 border-red-600/40 text-red-400'
            } p-4 rounded-lg mb-6 border`}
          >
            {message.text}
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
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => handleDateChange(date)}
                  dateFormat="dd.MM.yyyy"
                  locale="de"
                  required
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                  placeholderText="TT.MM.JJJJ"
                  isClearable
                />
                <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                Enddatum
              </label>
              <div className="relative">
                <DatePicker
                  selected={selectedEndDate}
                  onChange={(date) => handleDateChange(date, true)}
                  dateFormat="dd.MM.yyyy"
                  locale="de"
                  minDate={selectedDate || undefined}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                  placeholderText="TT.MM.JJJJ"
                  isClearable
                />
                <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium mb-2">
              Startzeit
            </label>
            <div className="relative">
              <DatePicker
                selected={selectedTime}
                onChange={handleTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Zeit"
                dateFormat="HH:mm"
                locale="de"
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                placeholderText="HH:mm"
                isClearable
              />
              <FaClock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" />
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
              Bild-URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="ticketUrl" className="block text-sm font-medium mb-2">
              Ticket-URL (optional)
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