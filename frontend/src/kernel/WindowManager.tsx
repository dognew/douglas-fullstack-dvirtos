import { useState, type ReactNode, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import { getAppComponent } from './AppRegistry';
import React, { Suspense } from 'react';

interface WindowInstance {
  id: string;
  type: string; 
  isMinimized: boolean;
  title: string;
  zIndex: number;
  Component?: React.LazyExoticComponent<React.ComponentType<any>>; // Refined: Explicit component type
}

interface WindowManagerProps {
  children: ReactNode;
}

/**
 * Layer 3: Window Manager
 * Responsibility: Manages window lifecycle, stacking order, and dynamic component spawning.
 * Refined: Migration to Dynamic AppRegistry (Meta 1) with strict TS prop handling.
 */
export const WindowManager = ({ children }: WindowManagerProps) => {
  const { state } = useSession();
  const status = state.layers?.windowManager || 'active';
  
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [windowStack, setWindowStack] = useState<string[]>([]);

  /**
   * Unified Spawn Engine
   * Dynamically resolves components via AppRegistry.
   */
  const spawnApp = (execName: string) => {
    const Component = getAppComponent(execName);
    
    if (!Component) {
      console.error(`[WindowManager] Execution failed: ${execName} not found.`);
      return;
    }

    const newId = `${execName}-${Date.now()}`;
    const title = execName.charAt(0).toUpperCase() + execName.slice(1);

    setWindows(prev => [...prev, { 
      id: newId, 
      type: execName, 
      isMinimized: false, 
      title: title,
      zIndex: 100 + windowStack.length,
      Component: Component 
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

  useEffect(() => {
    const handleSpawnSignal = (e: Event) => {
      const type = (e as CustomEvent).detail?.type;
      if (type) spawnApp(type);
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
      
      {/* Refined: Dynamic Window Rendering with Tag Syntax for Stability */}
      {windows.map((win) => {
        const stackIndex = windowStack.indexOf(win.id);
        const dynamicZIndex = 100 + stackIndex;
        
        // Use a capitalized variable so React recognizes it as a component
        const AppComponent = win.Component;

        return (
          <div key={win.id} style={{ zIndex: dynamicZIndex }} className="absolute inset-0 pointer-events-none">
            <div className="pointer-events-auto contents" onMouseDown={() => bringToFront(win.id)}>
              <Suspense fallback={null}>
                {AppComponent && (
                  <AppComponent 
                    isMinimized={win.isMinimized}
                    zIndex={dynamicZIndex}
                    onClose={() => handleClose(win.id)} 
                    onMinimize={() => handleMinimize(win.id)}
                  />
                )}
              </Suspense>
            </div>
          </div>
        );
      })}
    </div>
  );
};