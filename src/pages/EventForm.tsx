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
import { format, parseISO, setHours, setMinutes, setSeconds, setMilliseconds, isValid, parse } from 'date-fns';
import { z } from 'zod';

registerLocale('de', de);

// Zod Schema für die Event-Daten, validiert die Frontend-String-Formate
const eventSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  // Datum im Format TT.MM.JJJJ
  date: z.string().min(1, "Startdatum ist erforderlich").refine((val) => {
    const parsedDate = parse(val, 'dd.MM.yyyy', new Date());
    return isValid(parsedDate);
  }, "Ungültiges Startdatum (Format: TT.MM.JJJJ)"),
  // Enddatum optional im Format TT.MM.JJJJ oder leer
  endDate: z.string().optional().nullable().refine((val) => {
    if (!val) return true; // Leeres Feld ist erlaubt
    const parsedDate = parse(val, 'dd.MM.yyyy', new Date());
    return isValid(parsedDate);
  }, "Ungültiges Enddatum (Format: TT.MM.JJJJ)"),
  // Startzeit optional im Format HH:mm oder leer
  startTime: z.string().optional().nullable().refine((val) => {
    if (!val) return true; // Leeres Feld ist erlaubt
    const [hours, minutes] = val.split(':');
    // Einfache Validierung der Zeit-Komponenten
    const hoursNum = parseInt(hours, 10);
    const minutesNum = parseInt(minutes, 10);
    return !isNaN(hoursNum) && !isNaN(minutesNum) && hoursNum >= 0 && hoursNum < 24 && minutesNum >= 0 && minutesNum < 60;
  }, "Ungültige Startzeit (Format: HH:mm)"),
  description: z.string().optional().nullable(),
  venue: z.string().min(1, "Veranstaltungsort ist erforderlich"),
  location: z.string().min(1, "Adresse ist erforderlich"),
  imageUrl: z.string().url("Ungültige Bild-URL").optional().nullable().or(z.literal('')), // Leerer String auch erlauben für optional URL
  ticketUrl: z.string().url("Ungültige Ticket-URL").optional().nullable().or(z.literal('')), // Leerer String auch erlauben für optional URL
});

export function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Wir speichern die Werte als deutsche Strings, wie im Frontend angezeigt
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '', // TT.MM.JJJJ
    endDate: '', // TT.MM.JJJJ oder leer
    startTime: '', // HH:mm oder leer
    description: '', // Textarea gibt leeren String, nicht null
    venue: '',
    location: '',
    imageUrl: '',
    ticketUrl: '',
  });

  // Zustände für die DatePicker-Komponenten (Date Objekte - lokale Zeit)
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
          // Parsen und Setzen der Daten und Zeiten vom Backend (ISO 8601) in Frontend-Zustände
          // Datum
          if (event.date) {
            try {
              const date = parseISO(event.date); // ISO -> Lokales Date Objekt
              if (isValid(date)) {
                setSelectedDate(date); // Für DatePicker
                setFormData(prev => ({ ...prev, date: format(date, 'dd.MM.yyyy') })); // Für Formularfeld (Deutsch)
              } else {
                console.error('Ungültiges Startdatum vom Backend:', event.date);
                setSelectedDate(null);
                setFormData(prev => ({ ...prev, date: '' }));
              }
            } catch (error) {
              console.error('Fehler beim Parsen des Startdatums vom Backend:', error);
              setSelectedDate(null);
              setFormData(prev => ({ ...prev, date: '' }));
            }
          } else {
            setSelectedDate(null);
            setFormData(prev => ({ ...prev, date: '' }));
          }

          // Enddatum
          if (event.endDate) {
            try {
              const endDate = parseISO(event.endDate); // ISO -> Lokales Date Objekt
               if (isValid(endDate)) {
                setSelectedEndDate(endDate); // Für DatePicker
                setFormData(prev => ({ ...prev, endDate: format(endDate, 'dd.MM.yyyy') })); // Für Formularfeld (Deutsch)
              } else {
                 console.error('Ungültiges Enddatum vom Backend:', event.endDate);
                 setSelectedEndDate(null);
                 setFormData(prev => ({ ...prev, endDate: '' })); // Leerer String, da optional im Backend/Frontend
              }
            } catch (error) {
              console.error('Fehler beim Parsen des Enddatums vom Backend:', error);
              setSelectedEndDate(null);
              setFormData(prev => ({ ...prev, endDate: '' }));
            }
          } else {
            setSelectedEndDate(null);
            setFormData(prev => ({ ...prev, endDate: '' }));
          }

          // Startzeit
          if (event.startTime) {
             try {
              const startTimeDate = parseISO(event.startTime); // ISO -> Lokales Date Objekt
              if (isValid(startTimeDate)) {
                setSelectedTime(startTimeDate); // Für DatePicker (nur Zeit relevant)
                setFormData(prev => ({ ...prev, startTime: format(startTimeDate, 'HH:mm') })); // Für Formularfeld (Deutsch)
              } else {
                 console.error('Ungültige Startzeit vom Backend:', event.startTime);
                 setSelectedTime(null);
                 setFormData(prev => ({ ...prev, startTime: '' }));
              }
             } catch (error) {
              console.error('Fehler beim Parsen der Startzeit vom Backend:', error);
              setSelectedTime(null);
              setFormData(prev => ({ ...prev, startTime: '' }));
             }
          } else {
             setSelectedTime(null);
             setFormData(prev => ({ ...prev, startTime: '' }));
          }

          // Restliche Formulardaten setzen
          setFormData(prev => ({
            ...prev,
            title: event.title || '',
            description: event.description || '',
            venue: event.venue || '',
            location: event.location || '',
            imageUrl: event.imageUrl || '',
            ticketUrl: event.ticketUrl || '',
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

  // Handler für allgemeine Textfelder (nicht Datum/Zeit Picker)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Lösche vorherige Validierungsfehler für dieses Feld
    setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== name));
  };

  // Handler für Start- und Enddatum DatePicker
  const handleDateChange = (date: Date | null, isEndDate: boolean = false) => {
    if (isEndDate) {
      setSelectedEndDate(date);
       // Formatiere Date Objekt zu deutschem String für formData
      setFormData(prev => ({
        ...prev,
        endDate: date ? format(date, 'dd.MM.yyyy') : ''
      }));
       // Lösche Validierungsfehler
       setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== 'endDate'));
    } else {
      setSelectedDate(date);
       // Formatiere Date Objekt zu deutschem String für formData
      setFormData(prev => ({
        ...prev,
        date: date ? format(date, 'dd.MM.yyyy') : ''
      }));
       // Lösche Validierungsfehler
       setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== 'date'));
    }
  };

  // Handler für Startzeit DatePicker
  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
    // Formatiere Date Objekt zu deutschem Zeit-String für formData
    setFormData(prev => ({
      ...prev,
      startTime: time ? format(time, 'HH:mm') : ''
    }));
    // Lösche Validierungsfehler
    setErrors(prevErrors => prevErrors.filter(error => error.path[0] !== 'startTime'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]); // Reset errors on new submit attempt

    try {
      // Daten vor dem Senden validieren (basierend auf deutschen Strings)
      const validationResult = eventSchema.safeParse(formData);

      if (!validationResult.success) {
        // Validierungsfehler anzeigen
        console.error('Zod Validation Errors:', validationResult.error.errors);
        setErrors(validationResult.error.errors);
        showMessage('Bitte korrigieren Sie die Fehler im Formular.', 'error');
        setIsLoading(false);
        return; // Stoppe den Submit-Prozess
      }

      // Valide Daten extrahieren (immer noch deutsche Strings)
      const validFormData = validationResult.data;

      // Konvertiere deutsche Strings in ISO 8601 Timestamps für das Backend
      const dataToSend: any = {
        ...validFormData,
      };

      // Konvertiere Startdatum: TT.MM.JJJJ String zu ISO 8601 (Mitternacht UTC des Tages)
      if (validFormData.date) {
        const parsedDate = parse(validFormData.date, 'dd.MM.yyyy', new Date());
        if (isValid(parsedDate)) {
             // Erzeuge einen ISO 8601 String für das ausgewählte Datum um Mitternacht UTC
            dataToSend.date = format(parsedDate, 'yyyy-MM-dd') + 'T00:00:00.000Z';
        } else {
            // Dies sollte durch Zod-Validierung abgefangen werden, ist aber eine zusätzliche Sicherung
             console.error('Interner Fehler: Ungültiges Startdatum nach Validierung.', validFormData.date);
             showMessage('Interner Fehler bei der Datumskonvertierung.', 'error');
             setIsLoading(false);
             return;
        }
      }

      // Konvertiere Enddatum: TT.MM.JJJJ String zu ISO 8601 (Mitternacht UTC des Tages), wenn vorhanden
      if (validFormData.endDate) {
         const parsedEndDate = parse(validFormData.endDate, 'dd.MM.yyyy', new Date());
         if (isValid(parsedEndDate)) {
            // Erzeuge einen ISO 8601 String für das ausgewählte Datum um Mitternacht UTC
            dataToSend.endDate = format(parsedEndDate, 'yyyy-MM-dd') + 'T00:00:00.000Z';
         } else {
             // Sollte durch Zod abgefangen werden
              console.error('Interner Fehler: Ungültiges Enddatum nach Validierung.', validFormData.endDate);
              showMessage('Interner Fehler bei der Enddatumkonvertierung.', 'error');
              setIsLoading(false);
              return;
         }
      } else {
           dataToSend.endDate = null; // Sicherstellen, dass null gesendet wird, wenn Enddatum leer ist
      }

      // Konvertiere Startzeit: HH:mm String zu ISO 8601 (mit beliebigem Datum, z.B. 1970-01-01 UTC)
      if (validFormData.startTime) {
         const [hours, minutes] = validFormData.startTime.split(':');
         const hoursNum = parseInt(hours, 10);
         const minutesNum = parseInt(minutes, 10);

         if (!isNaN(hoursNum) && !isNaN(minutesNum)) {
             // Erzeuge einen ISO 8601 String mit der ausgewählten Zeit und einem festen UTC-Datum (1970-01-01).
             const referenceDateUTC = new Date(Date.UTC(1970, 0, 1)); // 1970-01-01 00:00:00 UTC
             const timeInUTC = setHours(setMinutes(referenceDateUTC, minutesNum), hoursNum);
              // Verwende toISOString(), um den vollständigen Timestamp zu erhalten.
              // Das Backend wird die Zeitkomponente daraus extrahieren.
             dataToSend.startTime = timeInUTC.toISOString();
         } else {
             // Sollte durch Zod abgefangen werden
              console.error('Interner Fehler: Ungültige Startzeit nach Validierung.', validFormData.startTime);
              showMessage('Interner Fehler bei der Zeitkonvertierung.', 'error');
              setIsLoading(false);
              return;
         }
      } else {
          dataToSend.startTime = null; // Sicherstellen, dass null gesendet wird, wenn Startzeit leer ist
      }

       // Leere Strings für optionale URL-Felder in null umwandeln, falls Backend das erwartet
       if (dataToSend.imageUrl === '') dataToSend.imageUrl = null;
       if (dataToSend.ticketUrl === '') dataToSend.ticketUrl = null;

      let result;
      if (isEditMode && id) {
        console.log('Updating event with data:', dataToSend);
        result = await updateEvent(id, dataToSend);
        showMessage('Event erfolgreich aktualisiert', 'success');
        // navigate('/admin/events'); // Weiterleitung nach Update
      } else {
        console.log('Creating event with data:', dataToSend);
        result = await createEvent(dataToSend);
        showMessage('Event erfolgreich erstellt', 'success');
        // Formular zurücksetzen nach erfolgreichem Erstellen, aber nur im Create-Modus
        if (!isEditMode) {
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
        // navigate('/admin/events'); // Weiterleitung nach Erstellen
      }
       // Weiterleitung nach erfolgreichem Speichern (Update oder Create)
       navigate('/admin/events');

    } catch (error: any) {
      console.error('Fehler beim Speichern des Events:', error);
      // Andere Fehler (Netzwerk, Backend, etc.)
      if (error instanceof Response && error.status === 401) {
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
    const error = errors.find(err => err.path && err.path[0] === fieldName);
    return error ? error.message : null;
  };

  if (isEditMode && initialLoading) {
    return <div className="text-white">Event wird geladen...</div>;
  }

  if (isEditMode && loadError) {
    return <div className="text-red-500">Fehler beim Laden des Events: {loadError}</div>;
  }

  const getDatePickerDateValue = (formDataValue: string | null | undefined): Date | null => {
      if (!formDataValue) return null;
      const parsedDate = parse(formDataValue, 'dd.MM.yyyy', new Date());
      return isValid(parsedDate) ? parsedDate : null;
  };

   const getDatePickerTimeValue = (formDataValue: string | null | undefined): Date | null => {
       if (!formDataValue) return null;
        try {
            const [hours, minutes] = formDataValue.split(':');
            const hoursNum = parseInt(hours, 10);
            const minutesNum = parseInt(minutes, 10);
            if (!isNaN(hoursNum) && !isNaN(minutesNum)) {
                 const now = new Date();
                return setMinutes(setHours(now, hoursNum), minutesNum);
            }
            return null;
        } catch (e) {
            console.error('Fehler beim Parsen des Zeit-Strings für DatePicker:', formDataValue, e);
            return null;
        }
    };


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
                // Sicherstellen, dass error.path existiert und nicht leer ist
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
                  // DatePicker value should be a Date object or null
                  selected={getDatePickerDateValue(formData.date)}
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
                  // DatePicker value should be a Date object or null
                  selected={getDatePickerDateValue(formData.endDate)}
                  onChange={(date) => handleDateChange(date, true)}
                  dateFormat="dd.MM.yyyy"
                  locale="de"
                  minDate={getDatePickerDateValue(formData.date) || undefined}
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
                selected={getDatePickerTimeValue(formData.startTime)}
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