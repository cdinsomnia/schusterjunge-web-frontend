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
import { format, parseISO, isValid, parse, startOfDay, setHours, setMinutes } from 'date-fns';
import { z } from 'zod';

registerLocale('de', de);

// Zod Schema für die Event-Daten
const eventSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  date: z.string().min(1, "Startdatum ist erforderlich").refine((val) => {
    const parsedDate = parse(val, 'dd.MM.yyyy', new Date());
    return isValid(parsedDate);
  }, "Ungültiges Startdatum (Format: TT.MM.JJJJ)"),
  endDate: z.string().optional().nullable().refine((val) => {
    if (!val) return true;
    const parsedDate = parse(val, 'dd.MM.yyyy', new Date());
    return isValid(parsedDate);
  }, "Ungültiges Enddatum (Format: TT.MM.JJJJ)"),
  startTime: z.string().optional().nullable().refine((val) => {
    if (!val) return true;
    const [hours, minutes] = val.split(':');
    const hoursNum = parseInt(hours, 10);
    const minutesNum = parseInt(minutes, 10);
    return !isNaN(hoursNum) && !isNaN(minutesNum) && hoursNum >= 0 && hoursNum < 24 && minutesNum >= 0 && minutesNum < 60;
  }, "Ungültige Startzeit (Format: HH:mm)"),
  description: z.string().optional().nullable(),
  venue: z.string().min(1, "Veranstaltungsort ist erforderlich"),
  location: z.string().min(1, "Adresse ist erforderlich"),
  imageUrl: z.string().url("Ungültige Bild-URL").optional().nullable().or(z.literal('')),
  ticketUrl: z.string().url("Ungültige Ticket-URL").optional().nullable().or(z.literal('')),
});

export function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    endDate: '',
    startTime: '',
    description: '',
    venue: '',
    location: '',
    imageUrl: '',
    ticketUrl: '',
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  // Helper function to convert backend timestamp to local date/time
  const parseBackendTimestamp = (timestamp: string | null | undefined) => {
    if (!timestamp) return null;
    try {
      const date = parseISO(timestamp);
      return isValid(date) ? date : null;
    } catch (error) {
      console.error('Error parsing timestamp:', timestamp, error);
      return null;
    }
  };

  // Helper function to create a datetime from date and time in user's timezone
  const createDateTimeInUserTimezone = (dateStr: string, timeStr?: string) => {
    const parsedDate = parse(dateStr, 'dd.MM.yyyy', new Date());
    if (!isValid(parsedDate)) return null;

    if (timeStr) {
      const [hours, minutes] = timeStr.split(':');
      const hoursNum = parseInt(hours, 10);
      const minutesNum = parseInt(minutes, 10);
      
      if (!isNaN(hoursNum) && !isNaN(minutesNum)) {
        return setMinutes(setHours(parsedDate, hoursNum), minutesNum);
      }
    }
    
    return startOfDay(parsedDate);
  };

  useEffect(() => {
    async function loadEvent() {
      if (!isEditMode || !id) {
        setInitialLoading(false);
        return;
      }

      try {
        const event = await getEvent(id);

        if (event) {
          // Parse dates from backend (they come as ISO strings)
          const eventDate = parseBackendTimestamp(event.date);
          const eventEndDate = parseBackendTimestamp(event.endDate);
          const eventStartTime = parseBackendTimestamp(event.startTime);

          // Set main date
          if (eventDate) {
            setSelectedDate(eventDate);
            setFormData(prev => ({ ...prev, date: format(eventDate, 'dd.MM.yyyy') }));
          }

          // Set end date
          if (eventEndDate) {
            setSelectedEndDate(eventEndDate);
            setFormData(prev => ({ ...prev, endDate: format(eventEndDate, 'dd.MM.yyyy') }));
          }

          // Set start time - if we have both date and startTime, combine them properly
          if (eventDate && eventStartTime) {
            // Extract time from startTime and apply it to the event date
            const timeHours = eventStartTime.getHours();
            const timeMinutes = eventStartTime.getMinutes();
            const combinedDateTime = setMinutes(setHours(eventDate, timeHours), timeMinutes);
            
            setSelectedTime(combinedDateTime);
            setFormData(prev => ({ 
              ...prev, 
              startTime: format(eventStartTime, 'HH:mm') 
            }));
          } else if (eventStartTime) {
            // Fallback: use startTime as-is
            setSelectedTime(eventStartTime);
            setFormData(prev => ({ 
              ...prev, 
              startTime: format(eventStartTime, 'HH:mm') 
            }));
          }

          // Set other form data
          setFormData(prev => ({
            ...prev,
            title: event.title || '',
            description: event.description || '',
            venue: event.venue || '',
            location: event.location || '',
            imageUrl: event.imageUrl || '',
            ticketUrl: event.ticketUrl || '',
          }));

        } else {
          console.warn(`Event with ID ${id} not found.`);
          navigate('/admin/events');
        }
      } catch (error: any) {
        console.error('Error loading event:', error);
        if (error instanceof Response && error.status === 401) {
          showMessage('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.', 'error');
          setTimeout(() => navigate('/admin/login'), 2000);
        } else {
          setLoadError('Fehler beim Laden der Eventdaten.');
        }
      } finally {
        setInitialLoading(false);
      }
    }

    loadEvent();
  }, [id, isEditMode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== name));
  };

  const handleDateChange = (date: Date | null, isEndDate: boolean = false) => {
    if (isEndDate) {
      setSelectedEndDate(date);
      setFormData(prev => ({
        ...prev,
        endDate: date ? format(date, 'dd.MM.yyyy') : ''
      }));
      setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== 'endDate'));
    } else {
      setSelectedDate(date);
      setFormData(prev => ({
        ...prev,
        date: date ? format(date, 'dd.MM.yyyy') : ''
      }));
      setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== 'date'));
      
      // If we change the main date and have a time selected, update the time picker's date part
      if (date && selectedTime) {
        const newDateTime = setMinutes(
          setHours(date, selectedTime.getHours()), 
          selectedTime.getMinutes()
        );
        setSelectedTime(newDateTime);
      }
    }
  };

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
    setFormData(prev => ({
      ...prev,
      startTime: time ? format(time, 'HH:mm') : ''
    }));
    setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== 'startTime'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      const validationResult = eventSchema.safeParse(formData);

      if (!validationResult.success) {
        setErrors(validationResult.error.errors);
        showMessage('Bitte korrigieren Sie die Fehler im Formular.', 'error');
        setIsLoading(false);
        return;
      }

      const validFormData = validationResult.data;
      const dataToSend: any = { ...validFormData };

      // Convert main date
      if (validFormData.date) {
        const eventDateTime = createDateTimeInUserTimezone(validFormData.date, validFormData.startTime);
        if (eventDateTime) {
          // Send the full datetime for the main date field
          dataToSend.date = eventDateTime.toISOString();
        } else {
          // Fallback: just the date at start of day
          const dateOnly = createDateTimeInUserTimezone(validFormData.date);
          if (dateOnly) {
            dataToSend.date = dateOnly.toISOString();
          }
        }
      }

      // Convert end date
      if (validFormData.endDate) {
        const endDateTime = createDateTimeInUserTimezone(validFormData.endDate);
        if (endDateTime) {
          dataToSend.endDate = endDateTime.toISOString();
        }
      } else {
        dataToSend.endDate = null;
      }

      // Convert start time
      if (validFormData.startTime && validFormData.date) {
        const startDateTime = createDateTimeInUserTimezone(validFormData.date, validFormData.startTime);
        if (startDateTime) {
          dataToSend.startTime = startDateTime.toISOString();
        }
      } else {
        dataToSend.startTime = null;
      }

      // Handle empty optional fields
      if (dataToSend.imageUrl === '') dataToSend.imageUrl = null;
      if (dataToSend.ticketUrl === '') dataToSend.ticketUrl = null;

      let result;
      if (isEditMode && id) {
        console.log('Updating event with data:', dataToSend);
        result = await updateEvent(id, dataToSend);
        showMessage('Event erfolgreich aktualisiert', 'success');
      } else {
        console.log('Creating event with data:', dataToSend);
        result = await createEvent(dataToSend);
        showMessage('Event erfolgreich erstellt', 'success');
        
        if (!isEditMode) {
          // Reset form
          setFormData({
            title: '',
            date: '',
            endDate: '',
            startTime: '',
            description: '',
            venue: '',
            location: '',
            imageUrl: '',
            ticketUrl: '',
          });
          setSelectedDate(null);
          setSelectedEndDate(null);
          setSelectedTime(null);
        }
      }
      
      navigate('/admin/events');

    } catch (error: any) {
      console.error('Error saving event:', error);
      if (error instanceof Response && error.status === 401) {
        showMessage('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.', 'error');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler beim Speichern.';
        showMessage(`Fehler beim Speichern des Events: ${errorMessage}`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const getErrorMessage = (fieldName: string) => {
    const error = errors.find(err => err.path && err.path[0] === fieldName);
    return error ? error.message : null;
  };

  if (isEditMode && initialLoading) {
    return <div className="text-white">Event wird geladen...</div>;
  }

  if (isEditMode && loadError) {
    return <div className="text-red-500">Fehler beim Laden des Events: {loadError}</div>;
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
            className={`${message.type === 'success'
                ? 'bg-green-600/20 border-green-600/40 text-green-400'
                : 'bg-red-600/20 border-red-600/40 text-red-400'
              } p-4 rounded-lg mb-6 border`}
          >
            {message.text}
          </motion.div>
        )}

        {errors.length > 0 && (
           <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-600/20 border-red-600/40 text-red-400 p-4 rounded-lg mb-6 border"
          >
            <p className="font-bold">Validierungsfehler:</p>
            <ul className="mt-2 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{`${error.path && error.path.length > 0 ? error.path.join('.') + ': ' : ''}${error.message}`}</li>
              ))}
            </ul>
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
              className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                ${getErrorMessage('title') ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:ring-blue-500/50 focus:border-transparent'}
              `}
            />
             {getErrorMessage('title') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('title')}</p>}
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
                  className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                     ${getErrorMessage('date') ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:ring-blue-500/50 focus:border-transparent'}
                  `}
                  placeholderText="TT.MM.JJJJ"
                  isClearable
                />
                <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
               {getErrorMessage('date') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('date')}</p>}
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
                  className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                     ${getErrorMessage('endDate') ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:ring-blue-500/50 focus:border-transparent'}
                  `}
                  placeholderText="TT.MM.JJJJ"
                  isClearable
                />
                <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
               {getErrorMessage('endDate') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('endDate')}</p>}
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
                className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                     ${getErrorMessage('startTime') ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:ring-blue-500/50 focus:border-transparent'}
                  `}
                placeholderText="HH:mm"
                isClearable
              />
              <FaClock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
            {getErrorMessage('startTime') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('startTime')}</p>}
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
                 className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                     ${getErrorMessage('venue') ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:ring-blue-500/50 focus:border-transparent'}
                  `}
              />
              <FaBuilding className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            </div>
            {getErrorMessage('venue') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('venue')}</p>}
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
                 className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                     ${getErrorMessage('location') ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:ring-blue-500/50 focus:border-transparent'}
                  `}
              />
              <FaMapMarkerAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            </div>
            {getErrorMessage('location') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('location')}</p>}
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
                rows={4}
                 className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                     ${getErrorMessage('description') ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:ring-blue-500/50 focus:border-transparent'}
                  `}
              />
              <FaInfoCircle className="absolute right-4 top-4 text-zinc-500" />
            </div>
            {getErrorMessage('description') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('description')}</p>}
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
               className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                     ${getErrorMessage('imageUrl') ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:ring-blue-500/50 focus:border-transparent'}
                  `}
            />
            {getErrorMessage('imageUrl') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('imageUrl')}</p>}
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
               className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                     ${getErrorMessage('ticketUrl') ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:ring-blue-500/50 focus:border-transparent'}
                  `}
            />
             {getErrorMessage('ticketUrl') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('ticketUrl')}</p>}
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