/* eslint-disable */
import type Pusher from 'pusher-js';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      VUE_ROUTER_MODE?: 'hash' | 'history' | 'abstract';
      VUE_ROUTER_BASE?: string;
    }
  }

  interface Window {
    Pusher: typeof Pusher;
  }
}

export {};
