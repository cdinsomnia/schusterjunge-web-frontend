import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ImprintPage } from './pages/ImprintPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { Events } from './pages/Events';
import { AdminEvents } from './pages/AdminEvents';
import { EventForm } from './pages/EventForm';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { IntroSection } from './components/IntroSection';
import { MusicSection } from './components/MusicSection';
import { AccordionSection } from './components/AccordionSection';
import { VeranstalterKit } from './pages/VeranstalterKit';
import { CookieBanner } from './components/CookieBanner';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="imprint" element={<ImprintPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="events" element={<Events />} />
          <Route path="kit" element={<VeranstalterKit />} />
          <Route path="admin">
            <Route path="login" element={<Login />} />
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="events" element={<AdminEvents />} />
              <Route path="events/new" element={<EventForm />} />
              <Route path="events/:id" element={<EventForm />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  );
}

export default App;