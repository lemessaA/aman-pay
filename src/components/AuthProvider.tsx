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

interface AuthContextType {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  platform: 'telegram' | 'web' | 'mock';
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [platform, setPlatform] = useState<'telegram' | 'web' | 'mock'>('web');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const checkTelegram = () => {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        // @ts-ignore
        const tg = window.Telegram.WebApp as TelegramWebApp;
        if (tg.initDataUnsafe?.user) {
          tg.ready();
          tg.expand();
          setWebApp(tg);
          setUser(tg.initDataUnsafe.user);
          setPlatform('telegram');
          setIsLoading(false);
          return true;
        }
      }
      return false;
    };

    // Immediate check
    if (!checkTelegram()) {
      // Polling check (for slow script loading)
      const interval = setInterval(() => {
        if (checkTelegram()) {
          clearInterval(interval);
        }
      }, 100);

      // Standalone/Mock Fallback: If Telegram isn't found after 500ms, use mock for development/web
      timeout = setTimeout(() => {
        clearInterval(interval);
        if (!user) {
          console.log("[Lega-AI] Standard Web Mode Activated");
          setUser({
            id: 8888888,
            first_name: "TROY",
            username: "troy_web",
            language_code: "en"
          });
          setPlatform('web');
          setIsLoading(false);
        }
      }, 500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ webApp, user, platform, isLoading }}>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
      />
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Deprecated alias for backward compatibility during transition
export const useTelegram = useAuth;
