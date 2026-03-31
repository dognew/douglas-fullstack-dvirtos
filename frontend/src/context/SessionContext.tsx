import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useHardware } from '../hooks/useHardware';

/** 
 * Define the possible stages of the system boot process 
 */
export type BootStage = 'BIOS' | 'SETUP' | 'BOOT_MENU' | 'BOOT_ERROR' | 'GRUB' | 'PLYMOUTH' | 'LOGIN' | 'DESKTOP';

/** 
 * Define the operational status of a system layer 
 */
export type LayerStatus = 'active' | 'hidden' | 'terminated';

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
    skipIntro: boolean;
  };
  /* System layers visibility and lifecycle state */
  layers: {
    xserver: LayerStatus;
    windowManager: LayerStatus;
    desktopShell: LayerStatus;
  };
  /* Support for dynamic wallpapers */
  wallpaper: string | 'default';
}

interface SessionContextType {
  state: SessionState;
  setStage: (stage: BootStage) => void;
  setSelectedOS: (os: string) => void;
  setWallpaper: (url: string | 'default') => void;
  setAuth: (visitorType: string) => void;
  setSkipIntro: (value: boolean) => void;
  setLayerStatus: (layerId: keyof SessionState['layers'], status: LayerStatus) => void;
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

  /* State for system layers */
  const [layers, setLayers] = useState<SessionState['layers']>({
    xserver: 'active',
    windowManager: 'active',
    desktopShell: 'active'
  });

  /* Initialize wallpaper state from sessionStorage if available */
  const [wallpaper, setWallpaperState] = useState<string | 'default'>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('dvirtos_wallpaper') || 'default';
    }
    return 'default';
  });

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
    
    /* Sync auth, preferences and wallpaper on storage events */
    const savedType = sessionStorage.getItem('selected_visitor_type');
    const savedIntro = sessionStorage.getItem('dvirtos_skip_intro') === 'true';
    const savedWallpaper = sessionStorage.getItem('dvirtos_wallpaper') || 'default';
    
    if (savedType) {
      setVisitorType(savedType);
      setIsAuthenticated(true);
    }
    setSkipIntroState(savedIntro);
    setWallpaperState(savedWallpaper);
  }, []);

  useEffect(() => {
    updateStorageDump();
    window.addEventListener('storage', updateStorageDump);
    return () => window.removeEventListener('storage', updateStorageDump);
  }, [updateStorageDump]);

  /**
   * Function to update wallpaper with persistence
   */
  const setWallpaper = (url: string | 'default') => {
    sessionStorage.setItem('dvirtos_wallpaper', url);
    setWallpaperState(url);
  };

  const reboot = () => {
    setStageState('BIOS');
    window.location.reload();
  };

  const logoff = () => {
    /* Clear sensitive data but keep wallpaper preference for better UX */
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

  /**
   * Updates the status of a specific system layer
   */
  const setLayerStatus = (layerId: keyof SessionState['layers'], status: LayerStatus) => {
    setLayers(prev => ({
      ...prev,
      [layerId]: status
    }));
  };

  const value: SessionContextType = {
    state: {
      boot: { stage, selectedOS },
      hardware: { specs, loading },
      auth: { isAuthenticated, visitorType },
      storage: { 
        session: sessionRaw,
        skipIntro 
      },
      layers,
      wallpaper
    },
    setStage: setStageState,
    setSelectedOS: setSelectedOSState,
    setAuth,
    setWallpaper,
    setSkipIntro,
    setLayerStatus,
    reboot,
    logoff
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

/**
 * Hook to access the session context
 */
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
};