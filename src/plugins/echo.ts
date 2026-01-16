import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_WS_PORT,
  wssPort: import.meta.env.VITE_REVERB_WSS_PORT,
  forceTLS: false, // TRUE - PROD
  enabledTransports: import.meta.env.VITE_REVERB_ENABLED_TRANSPORTS,
  encrypted: false,
  withCredentials: true,
});

export default echo;
