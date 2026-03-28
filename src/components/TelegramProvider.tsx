'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Script from 'next/script';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  requestContact: (callback: (sent: boolean) => void) => void;
  isVersionAtLeast: (version: string) => boolean;
  initDataUnsafe: {
    user?: TelegramUser;
  };
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const checkTelegram = () => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp as TelegramWebApp;
        if (tg.initDataUnsafe?.user) {
          tg.ready();
          tg.expand();
          setWebApp(tg);
          setUser(tg.initDataUnsafe.user);
          return true;
        }
      }
      return false;
    };

    // Immediate check
    if (!checkTelegram()) {
      // Polling check (for slow script loading)
      const interval = setInterval(() => {
        if (checkTelegram()) clearInterval(interval);
      }, 100);

      // Development Mock: If we're on localhost and Telegram isn't found after 500ms, inject mock
      timeout = setTimeout(() => {
        clearInterval(interval);
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && !user) {
          console.log("[Lega-AI] Injected Development Mock User");
          setUser({
            id: 12345678,
            first_name: "TROY (DEV)",
            username: "troy_dev",
            language_code: "en"
          });
        }
      }, 500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [user]);

  return (
    <TelegramContext.Provider value={{ webApp, user }}>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
      />
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
