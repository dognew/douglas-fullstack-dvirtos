import { type ReactNode, useEffect } from 'react';
import { useSession } from '../context/SessionContext';

interface XServerProps {
  children: ReactNode;
}

/**
 * Layer 1: XServer
 * Responsibilities: Render canvas and load graphical resources.
 * Integrated: Manual layer visibility control.
 */
export const XServer = ({ children }: XServerProps) => {
  const { state } = useSession();
  const status = state.layers?.xserver || 'active';
  
  useEffect(() => {
    const themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.id = 'xserver-cursor-theme';
    themeLink.href = '/dvirtos/usr/share/themes/dvirtos-default/cursor.css';
    
    document.head.appendChild(themeLink);

    return () => {
      const link = document.getElementById('xserver-cursor-theme');
      if (link) link.remove();
    };
  }, []);

  /* If terminated, the Manager already handles it. We handle 'hidden' here */
  return (
    <div 
      className={`x11-server-root w-full h-screen relative overflow-hidden cursor-x11-xcursor
        ${status === 'hidden' ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
      style={{
        backgroundColor: '#444',
        backgroundImage: `radial-gradient(#555 1px, transparent 0)`,
        backgroundSize: '2px 2px',
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div className="x11-canvas w-full h-full relative z-0 bg-transparent">
        {/* Cascade Termination: If WM is terminated, don't render children */}
        {state.layers?.windowManager !== 'terminated' && children}
      </div>
    </div>
  );
};