import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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
  /* Added auth object to state definition */
  auth: {
    isAuthenticated: boolean;
    visitorType: string | null;
  };
  storage: {
    session: Record<string, string | null>;
  };
}

interface SessionContextType {
  state: SessionState;
  setStage: (stage: BootStage) => void;
  setSelectedOS: (os: string) => void;
  /* Updated setAuth signature to handle login events */
  setAuth: (visitorType: string) => void;
  reboot: () => void;
  logoff: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { specs, loading } = useHardware();
  const [stage, setStageState] = useState<BootStage>('BIOS');
  const [selectedOS, setSelectedOSState] = useState<string>('dvirtos');
  /* New internal states for auth persistence */
  const [visitorType, setVisitorType] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionRaw, setSessionRaw] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const updateStorageDump = () => {
      const dump: Record<string, string | null> = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) dump[key] = sessionStorage.getItem(key);
      }
      setSessionRaw(dump);
      
      /* Sync local auth state with storage if needed */
      const savedType = sessionStorage.getItem('selected_visitor_type');
      if (savedType) {
        setVisitorType(savedType);
        setIsAuthenticated(true);
      }
    };

    updateStorageDump();
    window.addEventListener('storage', updateStorageDump);
    return () => window.removeEventListener('storage', updateStorageDump);
  }, [stage]);

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
    setVisitorType(type);
    setIsAuthenticated(true);
  };

  const value: SessionContextType = {
    state: {
      boot: { stage, selectedOS },
      hardware: { specs, loading },
      /* Exposing auth object to the system */
      auth: { isAuthenticated, visitorType },
      storage: { session: sessionRaw }
    },
    setStage: setStageState,
    setSelectedOS: setSelectedOSState,
    setAuth,
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