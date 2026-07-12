/* eslint-disable */
/// <reference types="vite/client" />
import type Pusher from 'pusher-js';

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_REVERB_APP_KEY: string;
  readonly VITE_REVERB_HOST: string;
  readonly VITE_REVERB_WS_PORT: string;
  readonly VITE_REVERB_WSS_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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
