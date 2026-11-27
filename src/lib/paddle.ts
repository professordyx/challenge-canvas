type PaddleCheckout = { items: { priceId: string; quantity: number }[]; customer?: { email: string }; customData: { userId: string }; settings: { displayMode: 'overlay'; successUrl: string; allowLogout: boolean; variant: 'one-page' } };
interface PaddleBrowser {
  Environment: { set: (env: 'sandbox' | 'production') => void };
  Initialize: (options: { token: string }) => void;
  Checkout: { open: (options: PaddleCheckout) => void };
}
declare global { interface Window { Paddle?: PaddleBrowser } }
const token = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;
export function getPaddleEnvironment(): 'sandbox' | 'live' { return token?.startsWith('test_') ? 'sandbox' : 'live'; }
let initialization: Promise<PaddleBrowser> | undefined;
export function initializePaddle(): Promise<PaddleBrowser> {
  if (initialization) return initialization;
  initialization = new Promise((resolve, reject) => {
    if (!token) { reject(new Error('Payments are unavailable')); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.onload = () => {
      try {
        const paddle = window.Paddle;
        if (!paddle) throw new Error('Checkout unavailable');
        paddle.Environment.set(getPaddleEnvironment() === 'sandbox' ? 'sandbox' : 'production');
        paddle.Initialize({ token });
        resolve(paddle);
      } catch (error) { reject(error); }
    };
    script.onerror = () => { script.remove(); reject(new Error('Checkout could not load')); };
    document.head.appendChild(script);
  }).catch((error) => { initialization = undefined; throw error; });
  return initialization;
}
