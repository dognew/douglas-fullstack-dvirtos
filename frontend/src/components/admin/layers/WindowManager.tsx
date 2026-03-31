import { useState, type ReactNode, useEffect } from 'react';
import { TerminalTest } from './apps/TerminalTest';

interface WindowInstance {
  id: string;
  type: 'terminal';
  isMinimized: boolean;
  title: string;
  zIndex: number; // Added to track depth
}

interface WindowManagerProps {
  children: ReactNode;
}

export const WindowManager = ({ children }: WindowManagerProps) => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100); // Start above desktop level

  useEffect(() => {
    const event = new CustomEvent('dvirtos:window_list_update', { detail: windows });
    window.dispatchEvent(event);
  }, [windows]);

  const bringToFront = (id: string) => {
    setNextZIndex(prev => prev + 1);
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, zIndex: nextZIndex + 1, isMinimized: false } : win
    ));
  };

  const spawnTerminal = () => {
    const newId = `term-${Date.now()}`;
    const newZ = nextZIndex + 1;
    setNextZIndex(newZ);
    
    setWindows(prev => [...prev, { 
      id: newId, 
      type: 'terminal', 
      isMinimized: false, 
      title: 'System Terminal',
      zIndex: newZ
    }]);
  };

  useEffect(() => {
    const handleSpawnSignal = (e: Event) => {
      if ((e as CustomEvent).detail?.type === 'terminal') spawnTerminal();
    };
    
    const handleToggleSignal = (e: Event) => {
      const id = (e as CustomEvent).detail?.id;
      const win = windows.find(w => w.id === id);
      if (win?.isMinimized) {
        bringToFront(id);
      } else {
        handleMinimize(id);
      }
    };

    window.addEventListener('dvirtos:spawn_app', handleSpawnSignal);
    window.addEventListener('dvirtos:toggle_window', handleToggleSignal);
    return () => {
      window.removeEventListener('dvirtos:spawn_app', handleSpawnSignal);
      window.removeEventListener('dvirtos:toggle_window', handleToggleSignal);
    };
  }, [windows, nextZIndex]);

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
        <div key={win.id} style={{ zIndex: win.zIndex }} className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto contents" onMouseDown={() => bringToFront(win.id)}>
            {win.type === 'terminal' && (
              <TerminalTest 
                isMinimized={win.isMinimized}
                zIndex={win.zIndex} // Passing Z to the app
                onClose={() => handleClose(win.id)} 
                onMinimize={() => handleMinimize(win.id)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};