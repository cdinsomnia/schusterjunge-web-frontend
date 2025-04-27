import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { AdminEvents } from './pages/AdminEvents';
import { EventForm } from './pages/EventForm';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          
          {/* Login-Route */}
          <Route path="admin/login" element={<Login />} />
          
          {/* Protected Management Route */}
          <Route 
            path="admin/events" 
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/events/new" 
            element={
              <ProtectedRoute>
                <EventForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/events/edit/:id" 
            element={
              <ProtectedRoute>
                <EventForm />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;