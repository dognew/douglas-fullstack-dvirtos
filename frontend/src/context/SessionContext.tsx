import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useHardware } from '../hooks/useHardware';

export type BootStage = 'BIOS' | 'SETUP' | 'BOOT_MENU' | 'BOOT_ERROR' | 'GRUB' | 'PLYMOUTH' | 'LOGIN' | 'DESKTOP';

interface SessionState {
  boot: {
    stage: BootStage;
    selectedOS: string;
  };
  hardware: {
    specs: any;
    loading: boolean;
  };
  auth: {
    isAuthenticated: boolean;
    visitorType: string | null;
  };
  storage: {
    session: Record<string, string | null>;
    skipIntro: boolean; // Persisted intro state
  };
}

interface SessionContextType {
  state: SessionState;
  setStage: (stage: BootStage) => void;
  setSelectedOS: (os: string) => void;
  setAuth: (visitorType: string) => void;
  setSkipIntro: (value: boolean) => void; // Function to persist preference
  reboot: () => void;
  logoff: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { specs, loading } = useHardware();
  const [stage, setStageState] = useState<BootStage>('BIOS');
  const [selectedOS, setSelectedOSState] = useState<string>('dvirtos');
  
  /* Internal state management */
  const [visitorType, setVisitorType] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [skipIntro, setSkipIntroState] = useState(false);
  const [sessionRaw, setSessionRaw] = useState<Record<string, string | null>>({});

  /**
   * Syncs the virtual system storage with browser's session storage
   */
  const updateStorageDump = useCallback(() => {
    const dump: Record<string, string | null> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) dump[key] = sessionStorage.getItem(key);
    }
    setSessionRaw(dump);
    
    /* Sync auth and preferences */
    const savedType = sessionStorage.getItem('selected_visitor_type');
    const savedIntro = sessionStorage.getItem('dvirtos_skip_intro') === 'true';
    
    if (savedType) {
      setVisitorType(savedType);
      setIsAuthenticated(true);
    }
    setSkipIntroState(savedIntro);
  }, []);

  useEffect(() => {
    updateStorageDump();
    window.addEventListener('storage', updateStorageDump);
    return () => window.removeEventListener('storage', updateStorageDump);
  }, [updateStorageDump]);

  const reboot = () => {
    setStageState('BIOS');
    window.location.reload();
  };

  const logoff = () => {
    sessionStorage.removeItem('selected_visitor_type');
    setVisitorType(null);
    setIsAuthenticated(false);
    setStageState('LOGIN');
  };

  const setAuth = (type: string) => {
    sessionStorage.setItem('selected_visitor_type', type);
    setVisitorType(type);
    setIsAuthenticated(true);
  };

  const setSkipIntro = (value: boolean) => {
    sessionStorage.setItem('dvirtos_skip_intro', String(value));
    setSkipIntroState(value);
  };

  const value: SessionContextType = {
    state: {
      boot: { stage, selectedOS },
      hardware: { specs, loading },
      auth: { isAuthenticated, visitorType },
      storage: { 
        session: sessionRaw,
        skipIntro 
      }
    },
    setStage: setStageState,
    setSelectedOS: setSelectedOSState,
    setAuth,
    setSkipIntro,
    reboot,
    logoff
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
};