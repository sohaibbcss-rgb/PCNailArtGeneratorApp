import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Ensure CSS is imported so Vite bundles it

// Support both standard dev/Vercel ID and the WordPress plugin ID
const rootElement = document.getElementById('purelycomfy-nail-root') || document.getElementById('root');

if (!rootElement) {
  console.error("Could not find root element ('root' or 'purelycomfy-nail-root') to mount to");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}