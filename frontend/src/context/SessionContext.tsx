import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useHardware } from '../hooks/useHardware';

// Full compatibility with your existing stages
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
  storage: {
    session: Record<string, string | null>;
  };
}

interface SessionContextType {
  state: SessionState;
  setStage: (stage: BootStage) => void;
  setSelectedOS: (os: string) => void;
  reboot: () => void;
  logoff: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { specs, loading } = useHardware();
  const [stage, setStageState] = useState<BootStage>('BIOS');
  const [selectedOS, setSelectedOSState] = useState<string>('dvirtos');
  const [sessionRaw, setSessionRaw] = useState<Record<string, string | null>>({});

  // Sync session storage for the inspector
  useEffect(() => {
    const updateStorageDump = () => {
      const dump: Record<string, string | null> = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) dump[key] = sessionStorage.getItem(key);
      }
      setSessionRaw(dump);
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
    setStageState('LOGIN');
  };

  const value: SessionContextType = {
    state: {
      boot: { stage, selectedOS },
      hardware: { specs, loading },
      storage: { session: sessionRaw }
    },
    setStage: setStageState,
    setSelectedOS: setSelectedOSState,
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