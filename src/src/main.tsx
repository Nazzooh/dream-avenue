import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import './index.css';

// Import global styles
import '../styles/globals.css';

// Do not let an installed production service worker mask Vite changes locally.
if (import.meta.env.DEV && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => void registration.unregister());
  });
  if ('caches' in window) {
    void window.caches.keys().then((keys) => {
      keys.forEach((key) => void window.caches.delete(key));
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
