import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { motion } from 'framer-motion';

export function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const contentWrapperClasses = isHomePage ? 'min-h-screen' : 'min-h-screen pt-16';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black"
    >
      <Header />
      <div className={contentWrapperClasses}>
        <Outlet />
      </div>
      <Footer />
    </motion.div>
  );
}