import { useState, type ReactNode, useEffect } from 'react';
import { TerminalTest } from './apps/TerminalTest';

interface WindowInstance {
  id: string;
  type: 'terminal';
  isMinimized: boolean;
  title: string; // Added for Taskbar display
}

interface WindowManagerProps {
  children: ReactNode;
}

/**
 * Layer 3: Window Manager
 * Updated to broadcast window states to Layer 4 (Shell).
 */
export const WindowManager = ({ children }: WindowManagerProps) => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);

  /**
   * Broadcasts the current window list to the system
   */
  useEffect(() => {
    const event = new CustomEvent('dvirtos:window_list_update', { detail: windows });
    window.dispatchEvent(event);
  }, [windows]);

  const spawnTerminal = () => {
    const newId = `term-${Date.now()}`;
    setWindows(prev => [...prev, { 
      id: newId, 
      type: 'terminal', 
      isMinimized: false, 
      title: 'System Terminal' 
    }]);
  };

  useEffect(() => {
    const handleSpawnSignal = (e: Event) => {
      if ((e as CustomEvent).detail?.type === 'terminal') spawnTerminal();
    };
    
    // Signal from Taskbar to restore/minimize
    const handleToggleSignal = (e: Event) => {
      const id = (e as CustomEvent).detail?.id;
      handleMinimize(id);
    };

    window.addEventListener('dvirtos:spawn_app', handleSpawnSignal);
    window.addEventListener('dvirtos:toggle_window', handleToggleSignal);
    return () => {
      window.removeEventListener('dvirtos:spawn_app', handleSpawnSignal);
      window.removeEventListener('dvirtos:toggle_window', handleToggleSignal);
    };
  }, []);

  const handleClose = (id: string) => {
    setWindows(prev => prev.filter(win => win.id !== id));
  };

  const handleMinimize = (id: string) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isMinimized: !win.isMinimized } : win
    ));
  };

  return (
    <div className="window-manager-root w-full h-full relative overflow-hidden pointer-events-auto">
      {children}
      {windows.map((win) => (
        <div key={win.id}>
          {win.type === 'terminal' && (
            <TerminalTest 
              isMinimized={win.isMinimized}
              onClose={() => handleClose(win.id)} 
              onMinimize={() => handleMinimize(win.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};