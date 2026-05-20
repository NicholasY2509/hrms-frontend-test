import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Add Pusher to window so Laravel Echo can use it
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

let echoInstance: any = null;

export const initEcho = (token: string) => {
  if (typeof window === 'undefined') return null;
  if (echoInstance) return echoInstance;

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https', // Default to http (false)
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api').replace(/\/api\/?$/, '')}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });

  return echoInstance;
};
