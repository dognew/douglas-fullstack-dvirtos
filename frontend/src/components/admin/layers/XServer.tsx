import { type ReactNode, useEffect } from 'react';

interface XServerProps {
  children: ReactNode;
}

/**
 * Layer 1: XServer
 * Responsibilities: Render canvas and load graphical resources (cursors/themes).
 * Implementation: Restored the classic X11 stippled background.
 */
export const XServer = ({ children }: XServerProps) => {
  
  useEffect(() => {
    // System-level call to load the cursor theme
    const themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.id = 'xserver-cursor-theme';
    themeLink.href = '/dvirtos/usr/share/themes/dvirtos-default/cursor.css';
    
    document.head.appendChild(themeLink);

    return () => {
      // Cleanup when XServer is terminated (e.g., shutdown)
      const link = document.getElementById('xserver-cursor-theme');
      if (link) link.remove();
    };
  }, []);

  return (
    <div 
      className="x11-server-root w-full h-screen relative overflow-hidden cursor-x11-xcursor"
      style={{
        // Re-implemented the standard X11 Mesh Pattern (Stipple)
        backgroundColor: '#444',
        backgroundImage: `radial-gradient(#555 1px, transparent 0)`,
        backgroundSize: '2px 2px',
      }}
    >
      <div className="x11-canvas w-full h-full relative z-0 bg-transparent">
        {children}
      </div>
    </div>
  );
};