import { Link } from 'react-router-dom';
import CookieConsent from 'react-cookie-consent';

export function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Akzeptieren"
      cookieName="schusterjunge-cookie-consent"
      style={{
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(63, 63, 70, 0.5)',
        padding: '1rem',
        fontSize: '0.875rem',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}
      buttonStyle={{
        background: 'rgba(59, 130, 246, 0.1)',
        color: 'white',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      buttonWrapperStyle={{
        marginLeft: '1rem'
      }}
      expires={150}
    >
      <span className="text-center sm:text-left">
        Diese Website verwendet Cookies, um Ihnen ein optimales Nutzererlebnis zu bieten. 
        Mit der Nutzung unserer Website erklären Sie sich damit einverstanden. 
        Weitere Informationen finden Sie in unserer{' '}
        <Link 
          to="/privacy" 
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Datenschutzerklärung
        </Link>.
      </span>
    </CookieConsent>
  );
} 