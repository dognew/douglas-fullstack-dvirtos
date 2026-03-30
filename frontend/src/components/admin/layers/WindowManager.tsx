import { useState, type ReactNode, useEffect } from 'react';
import { TerminalTest } from './apps/TerminalTest';

/**
 * Window Instance Interface
 * Defines the properties for each running process instance.
 */
interface WindowInstance {
  id: string;
  type: 'terminal';
  isMinimized: boolean;
}

interface WindowManagerProps {
  children: ReactNode;
}

/**
 * Layer 3: Window Manager
 * Controls window lifecycle using geometric states for multiple instances.
 */
export const WindowManager = ({ children }: WindowManagerProps) => {
  /* Tracks all active window processes - Starts empty as requested */
  const [windows, setWindows] = useState<WindowInstance[]>([]);

  /**
   * Spawns a new terminal instance with a unique identifier
   */
  const spawnTerminal = () => {
    const newId = `term-${Date.now()}`;
    setWindows(prev => [...prev, { id: newId, type: 'terminal', isMinimized: false }]);
  };

  /**
   * Listen for system signals to spawn new applications
   */
  useEffect(() => {
    const handleSpawnSignal = (e: Event) => {
      if ((e as CustomEvent).detail?.type === 'terminal') {
        spawnTerminal();
      }
    };

    window.addEventListener('dvirtos:spawn_app', handleSpawnSignal);
    return () => window.removeEventListener('dvirtos:spawn_app', handleSpawnSignal);
  }, []);

  /**
   * Removes a specific window instance from the stack (Process Kill)
   */
  const handleClose = (id: string) => {
    setWindows(prev => prev.filter(win => win.id !== id));
  };

  /**
   * Toggles the minimized state for a specific window instance
   */
  const handleMinimize = (id: string) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isMinimized: !win.isMinimized } : win
    ));
  };

  return (
    <div className="window-manager-root w-full h-full relative overflow-hidden pointer-events-auto">
      {children}
      
      {/* Render processes based on the windows state array */}
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