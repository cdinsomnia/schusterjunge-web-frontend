import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const contentWrapperClasses = isHomePage ? 'min-h-screen' : 'min-h-screen pt-16';

  return (
    <div className="min-h-screen animate-fade-in bg-black">
      <Header />
      <div className={contentWrapperClasses}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}