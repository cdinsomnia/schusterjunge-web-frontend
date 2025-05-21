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
import { format, parseISO, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';
import { z } from 'zod';

registerLocale('de', de);

// Zod Schema für die Event-Daten
const eventSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  // Datum wird als ISO 8601 String erwartet
  date: z.string().refine((val) => !isNaN(parseISO(val).getTime()), "Ungültiges Startdatum"),
  // Enddatum und Startzeit sind optional und können null oder ein gültiger ISO 8601 String sein
  endDate: z.string().optional().nullable().refine((val) => val === null || val === undefined || !isNaN(parseISO(val).getTime()), "Ungültiges Enddatum"),
  startTime: z.string().optional().nullable().refine((val) => val === null || val === undefined || !isNaN(parseISO(val).getTime()), "Ungültige Startzeit"),
  description: z.string().optional().nullable(),
  venue: z.string().min(1, "Veranstaltungsort ist erforderlich"),
  location: z.string().min(1, "Adresse ist erforderlich"),
  imageUrl: z.string().url("Ungültige Bild-URL").optional().nullable(),
  ticketUrl: z.string().url("Ungültige Ticket-URL").optional().nullable(),
});

export function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Wir speichern die Werte im Format, das das Backend erwartet (ISO 8601 Timestamps oder null)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '', // Sollte ISO 8601 String sein, oder leer/null wenn optional
    endDate: null, // Sollte ISO 8601 String sein, oder null
    startTime: null, // Sollte ISO 8601 String sein (Zeitkomponente wird genutzt), oder null
    description: null,
    venue: null,
    location: null,
    imageUrl: null,
    ticketUrl: null
  });

  // Zustände für die DatePicker-Komponenten (Date Objekte)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  // selectedTime wird als Date-Objekt behandelt, aber nur die Zeit ist relevant für die Anzeige/Auswahl
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  // Lädt Eventdaten beim Editieren
  useEffect(() => {
    async function loadEvent() {
      if (!isEditMode || !id) {
        setInitialLoading(false);
        return;
      }

      try {
        const event = await getEvent(id);

        if (event) {
          // Parsen und Setzen des Startdatums
          if (event.date) {
            try {
              // Backend liefert ISO 8601 Timestamp
              const date = parseISO(event.date);
              if (!isNaN(date.getTime())) {
                setSelectedDate(date); // DatePicker braucht Date Objekt
                // formData wird hier nicht direkt aktualisiert, passiert über die handleChange Fkt. beim Rendern?
                // Nein, formData muss hier auch gesetzt werden, falls keine Interaktion folgt.
                setFormData(prev => ({ ...prev, date: event.date }));
              }
            } catch (error) {
              console.error('Fehler beim Parsen des Startdatums:', error);
              setSelectedDate(null);
              setFormData(prev => ({ ...prev, date: '' })); // Setze auf leer oder null bei Fehler
            }
          } else {
            setSelectedDate(null);
            setFormData(prev => ({ ...prev, date: '' }));
          }

          // Parsen und Setzen des Enddatums
          if (event.endDate) {
            try {
              const endDate = parseISO(event.endDate);
              if (!isNaN(endDate.getTime())) {
                setSelectedEndDate(endDate);
                 setFormData(prev => ({ ...prev, endDate: event.endDate }));
              }
            } catch (error) {
              console.error('Fehler beim Parsen des Enddatums:', error);
              setSelectedEndDate(null);
              setFormData(prev => ({ ...prev, endDate: null }));
            }
          } else {
            setSelectedEndDate(null);
            setFormData(prev => ({ ...prev, endDate: null }));
          }

          // Parsen und Setzen der Startzeit
          if (event.startTime) {
             try {
               // Backend liefert ISO 8601 Timestamp, wir brauchen nur die Zeitkomponente
              const startTimeDate = parseISO(event.startTime);
              if (!isNaN(startTimeDate.getTime())) {
                setSelectedTime(startTimeDate); // DatePicker braucht Date Objekt
                setFormData(prev => ({ ...prev, startTime: event.startTime }));
              }
             } catch (error) {
              console.error('Fehler beim Parsen der Startzeit:', error);
              setSelectedTime(null);
              setFormData(prev => ({ ...prev, startTime: null }));
             }
          } else {
             setSelectedTime(null);
             setFormData(prev => ({ ...prev, startTime: null }));
          }

          // Restliche Formulardaten setzen
          setFormData(prev => ({
            ...prev,
            title: event.title,
            description: event.description,
            venue: event.venue,
            location: event.location,
            imageUrl: event.imageUrl,
            ticketUrl: event.ticketUrl,
            // date, endDate, startTime werden separat oben gesetzt
          }));

          setIsLoading(false);
          setInitialLoading(false);
        } else {
          console.warn(`Event mit ID ${id} nicht gefunden.`);
          navigate('/admin/events');
          setIsLoading(false);
          setInitialLoading(false);
        }
      } catch (error: any) {
        console.error('Fehler beim Laden des Events:', error);
        if (error instanceof Response && error.status === 401) {
          showMessage('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.', 'error');
          setTimeout(() => {
            navigate('/admin/login');
          }, 2000);
        } else {
          setLoadError('Fehler beim Laden der Eventdaten.');
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
    // Setze die Zeit auf Mitternacht, um einen konsistenten Timestamp zu erzeugen
    const dateWithMidnight = date ? setMilliseconds(setSeconds(setMinutes(setHours(date, 0), 0), 0), 0) : null;
    const isoString = dateWithMidnight ? dateWithMidnight.toISOString() : ''; // Oder null, je nach Backend-Erwartung

    if (isEndDate) {
      setSelectedEndDate(date);
      setFormData(prev => ({
        ...prev,
        endDate: date ? isoString : null // null für Enddatum, wenn es gelöscht wird
      }));
    } else {
      setSelectedDate(date);
      setFormData(prev => ({
        ...prev,
        date: date ? isoString : '' // '' für Startdatum, wenn es gelöscht wird (da NOT NULL im Backend)
      }));
    }
     // Lösche vorherige Validierungsfehler für dieses Feld
    if (isEndDate) {
        setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== 'endDate'));
      } else {
        setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== 'date'));
      }
  };

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
    let isoString = null;
    if (time && !isNaN(time.getTime())) {
        // Erzeuge einen Timestamp mit der ausgewählten Zeit. Das Datum ist hierfür nicht relevant,
        // aber ein Timestamp benötigt ein Datum. Wir nehmen ein beliebiges Datum, z.B. 1970-01-01
        // Wichtig: Das Backend nutzt nur die Zeitkomponente dieses Timestamps.
        const referenceDate = new Date(1970, 0, 1);
        const timeWithDate = setMilliseconds(setSeconds(setMinutes(setHours(referenceDate, time.getHours()), time.getMinutes()), 0), 0);
        isoString = timeWithDate.toISOString();
    }

    setFormData(prev => ({
      ...prev,
      startTime: isoString
    }));
    // Lösche vorherige Validierungsfehler für dieses Feld
    setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== 'startTime'));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]); // Reset errors on new submit attempt

    try {
      // Daten vor dem Senden validieren
      const validatedData = eventSchema.parse(formData);

      let result;
      if (isEditMode && id) {
        console.log('Updating event with data:', validatedData);
        result = await updateEvent(id, validatedData);
        showMessage('Event erfolgreich aktualisiert', 'success');
        navigate('/admin/events');
      } else {
        console.log('Creating event with data:', validatedData);
        result = await createEvent(validatedData);
        showMessage('Event erfolgreich erstellt', 'success');
        // Formular zurücksetzen nach erfolgreichem Erstellen, aber nur im Create-Modus
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
      console.error('Fehler beim Speichern des Events:', error);
      if (error instanceof z.ZodError) {
        // Zod Validierungsfehler anzeigen
        console.error('Zod Validation Errors:', error.errors);
        setErrors(error.errors);
        showMessage('Bitte korrigieren Sie die Fehler im Formular.', 'error');
      } else if (error instanceof Response && error.status === 401) {
        showMessage('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.', 'error');
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      } else {
        const errorMessage = (error instanceof Error ? error.message : 'Unbekannter Fehler beim Speichern.');
        showMessage(`Fehler beim Speichern des Events: ${errorMessage}`, 'error');
      }
      setIsLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Funktion zum Anzeigen von Zod-Fehlermeldungen für ein bestimmtes Feld
  const getErrorMessage = (fieldName: string) => {
    const error = errors.find(err => err.path[0] === fieldName);
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
                <li key={index}>{`${error.path.join('.')}: ${error.message}`}</li>
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
                required
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