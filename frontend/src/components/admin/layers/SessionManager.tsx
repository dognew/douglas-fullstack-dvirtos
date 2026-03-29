import { type ReactNode, useEffect } from 'react';
import { useSession } from '../../../context/SessionContext';

interface SessionManagerProps {
  children: ReactNode;
}

/**
 * Layer 0: Session Manager
 * Responsibility: Orchestrates the session lifecycle and environment readiness.
 * Note: Background set to transparent to allow Layer 1 (XServer) visibility.
 */
export const SessionManager = ({ children }: SessionManagerProps) => {
  const { state, logoff } = useSession();
  
  const { isAuthenticated, visitorType } = state.auth;

  useEffect(() => {
    if (state.boot.stage === 'DESKTOP' && (!visitorType || !isAuthenticated)) {
      console.error('[SessionManager] Critical: Unauthorized access attempt to desktop.');
      logoff();
    }
  }, [state.boot.stage, visitorType, isAuthenticated, logoff]);

  return (
    <div className="session-root w-full h-screen bg-transparent overflow-hidden relative">
      {children}
    </div>
  );
};