import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Event, EventFormData } from '../lib/types';
import { getEvent, createEvent, updateEvent } from '../lib/events';

function emptyStringToNull(value: string | null | undefined): string | null | undefined {
  return value === '' ? null : value;
}

export function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = id !== 'new';

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    description: null,
    venue: null,
    location: null,
    imageUrl: null,
    ticketUrl: null,
  });

  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);


  useEffect(() => {
    async function loadEvent() {
       if (!isEditMode || !id) {
           setIsLoading(false);
           setInitialLoading(false);
           return;
       }

       setIsLoading(false);
       setInitialLoading(true);
       setLoadError(null);

       try {
           const event = await getEvent(id);

           if (event) {
               setFormData(prev => ({
                   ...prev,
                   title: event.title,
                   date: event.date ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(event.date)) : '',
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(null);
    setIsLoading(true);

    const dateStringFromForm = formData.date;
    const parts = dateStringFromForm.split('.');

     if (parts.length !== 3 || isNaN(parseInt(parts[0])) || isNaN(parseInt(parts[1])) || isNaN(parseInt(parts[2]))) {
         showMessage('Invalid date format. Please use DD.MM.YYYY.', 'error');
         setIsLoading(false);
         return;
     }

    const [day, month, year] = parts;
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    if (isNaN(dateObj.getTime()) || dateObj.getDate() !== parseInt(day) || dateObj.getMonth() !== parseInt(month) - 1 || dateObj.getFullYear() !== parseInt(year)) {
        showMessage('Invalid date. Please enter a valid date in DD.MM.YYYY format.', 'error');
        setIsLoading(false);
        return;
    }

    const dateForBackend = dateObj.toISOString();

    const dataToSend: Omit<EventFormData, 'id'> = {
        title: formData.title,
        date: dateForBackend,
        description: emptyStringToNull(formData.description) as string | null,
        venue: emptyStringToNull(formData.venue) as string | null,
        location: emptyStringToNull(formData.location) as string | null,
        imageUrl: emptyStringToNull(formData.imageUrl) as string | null,
        ticketUrl: emptyStringToNull(formData.ticketUrl) as string | null,
    };

    console.log('Submitting Event Data:', dataToSend);

    try {
      let result;
      if (isEditMode && id) {
        result = await updateEvent(id, dataToSend);
        showMessage('Event successfully updated', 'success');
        navigate('/admin/events');
      } else {
        result = await createEvent(dataToSend);
        showMessage('Event successfully created', 'success');
        if (!isEditMode) {
          setFormData({
            title: '', date: '', description: null, venue: null, location: null, imageUrl: null, ticketUrl: null
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
           showMessage(`Error saving event: ${errorMessage}`, 'error');
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
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="font-[Dela_Gothic_One] text-3xl text-white">
            {isEditMode ? 'Event bearbeiten' : 'Neues Event'}
          </h1>
          <Link to="/admin/events" className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-md">
            Zurück zur Übersicht
          </Link>
        </div>

        {message && (
          <div className={`p-3 rounded-md mb-6 ${message.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/20 p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
                Name der Veranstaltung
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Electro Night Vol.3"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-zinc-300 mb-1">
                Datum (TT.MM.JJJJ)
              </label>
              <input
                type="text"
                name="date"
                id="date"
                placeholder="z.B. 21.01.2026"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-zinc-300 mb-1">
                Club
              </label>
              <input
                type="text"
                name="venue"
                id="venue"
                placeholder="Club Bergwerk"
                value={formData.venue || ''}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-1">
                Ort
              </label>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Berlin"
                value={formData.location || ''}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-300 mb-1">
                Bild-URL (optional)
              </label>
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                placeholder="/events/fallback.png"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="ticketUrl" className="block text-sm font-medium text-zinc-300 mb-1">
                Ticket-URL (optional)
              </label>
              <input
                type="text"
                name="ticketUrl"
                id="ticketUrl"
                placeholder="https://tickets.example.com"
                value={formData.ticketUrl || ''}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

             <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
                    Beschreibung (optional)
                </label>
                <textarea
                    name="description"
                    id="description"
                    placeholder="Die Beschreibung der Veranstaltung (In einem zukünftigen Update sichtbar)"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-black border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md"
               disabled={isLoading}
            >
              {isLoading ? 'Wird gespeichert...' : isEditMode ? 'Aktualisieren' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default { EventForm };