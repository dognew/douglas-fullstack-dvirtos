import { useState, type ReactNode, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import { TerminalTest } from '../apps/terminal/TerminalTest';
import { DesktopSettings } from '../apps/settings/DesktopSettings';
import { WelcomeApp } from '../apps/welcome/WelcomeApp';

interface WindowInstance {
  id: string;
  type: 'terminal' | 'settings' | 'welcome';
  isMinimized: boolean;
  title: string;
  zIndex: number; 
}

interface WindowManagerProps {
  children: ReactNode;
}

export const WindowManager = ({ children }: WindowManagerProps) => {
  const { state } = useSession();
  const status = state.layers?.windowManager || 'active';
  
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [windowStack, setWindowStack] = useState<string[]>([]);

  const spawnWelcome = () => {
    const newId = `welcome-${Date.now()}`;
    setWindows(prev => [...prev, { 
      id: newId, type: 'welcome', isMinimized: false, title: 'Welcome',
      zIndex: 100 + windowStack.length
    }]);
    setWindowStack(prev => [...prev, newId]);
  };

  useEffect(() => {
    const updatedWindows = windows.map(win => ({
      ...win,
      zIndex: 100 + windowStack.indexOf(win.id)
    }));
    const event = new CustomEvent('dvirtos:window_list_update', { detail: updatedWindows });
    window.dispatchEvent(event);
  }, [windows, windowStack]);

  const bringToFront = (id: string) => {
    setWindowStack(prev => {
      if (prev[prev.length - 1] === id) return prev;
      const newStack = prev.filter(winId => winId !== id);
      return [...newStack, id];
    });
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isMinimized: false } : win
    ));
  };

  const spawnTerminal = () => {
    const newId = `term-${Date.now()}`;
    setWindows(prev => [...prev, { 
      id: newId, type: 'terminal', isMinimized: false, title: 'System Terminal',
      zIndex: 100 + windowStack.length
    }]);
    setWindowStack(prev => [...prev, newId]);
  };

  /* New: Logical Spawn for Desktop Settings */
  const spawnSettings = () => {
    const newId = `settings-${Date.now()}`;
    setWindows(prev => [...prev, { 
      id: newId, type: 'settings', isMinimized: false, title: 'Desktop Settings',
      zIndex: 100 + windowStack.length
    }]);
    setWindowStack(prev => [...prev, newId]);
  };

  useEffect(() => {
    const handleSpawnSignal = (e: Event) => {
      const type = (e as CustomEvent).detail?.type;
      if (type === 'terminal') spawnTerminal();
      if (type === 'settings') spawnSettings();
      if (type === 'welcome') spawnWelcome();
    };

    const handleToggleSignal = (e: Event) => {
      const id = (e as CustomEvent).detail?.id;
      const win = windows.find(w => w.id === id);
      if (win?.isMinimized || windowStack[windowStack.length - 1] !== id) {
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
  }, [windows, windowStack]);

  const handleClose = (id: string) => {
    setWindows(prev => prev.filter(win => win.id !== id));
    setWindowStack(prev => prev.filter(winId => winId !== id));
  };

  const handleMinimize = (id: string) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isMinimized: !win.isMinimized } : win
    ));
  };

  if (status === 'terminated') return null;

  return (
    <div 
      className={`window-manager-root w-full h-full relative overflow-hidden pointer-events-auto transition-opacity duration-300
        ${status === 'hidden' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {state.layers?.desktopShell !== 'terminated' && children}
      
      {windows.map((win) => {
        const stackIndex = windowStack.indexOf(win.id);
        const dynamicZIndex = 100 + stackIndex;

        return (
          <div key={win.id} style={{ zIndex: dynamicZIndex }} className="absolute inset-0 pointer-events-none">
            <div className="pointer-events-auto contents" onMouseDown={() => bringToFront(win.id)}>
              {win.type === 'terminal' && (
                <TerminalTest 
                  isMinimized={win.isMinimized}
                  zIndex={dynamicZIndex}
                  onClose={() => handleClose(win.id)} 
                  onMinimize={() => handleMinimize(win.id)}
                />
              )}
              {/* New: Conditional rendering for settings app */}
              {win.type === 'settings' && (
                <DesktopSettings 
                  zIndex={dynamicZIndex}
                  onClose={() => handleClose(win.id)} 
                />
              )}
              {win.type === 'welcome' && (
                <WelcomeApp 
                  zIndex={dynamicZIndex}
                  onClose={() => handleClose(win.id)} 
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};