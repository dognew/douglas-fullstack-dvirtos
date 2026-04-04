import { type ReactNode, useEffect } from 'react';
import { useSession } from '../context/SessionContext';

interface SessionManagerProps {
  children: ReactNode;
}

/**
 * Layer 0: Session Manager
 * Responsibility: Orchestrates the session lifecycle and layer visibility/existence.
 */
export const SessionManager = ({ children }: SessionManagerProps) => {
  const { state, logoff } = useSession();
  const { isAuthenticated, visitorType } = state.auth;
  
  /* Get layers state from context - default to 'active' if not yet defined */
  const layers = state.layers || {
    xserver: 'active',
    windowManager: 'active',
    desktopShell: 'active'
  };

  useEffect(() => {
    if (state.boot.stage === 'DESKTOP' && (!visitorType || !isAuthenticated)) {
      console.error('[SessionManager] Critical: Unauthorized access attempt to desktop.');
      logoff();
    }
  }, [state.boot.stage, visitorType, isAuthenticated, logoff]);

  return (
    <div className="session-root w-full h-screen bg-transparent overflow-hidden relative">
      {/* Conditional Rendering: If Layer 1 (XServer) is terminated, 
          nothing below it will be rendered.
      */}
      {layers.xserver !== 'terminated' && children}
    </div>
  );
};