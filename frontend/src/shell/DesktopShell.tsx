import { type ReactNode, useState, useEffect, type MouseEvent } from 'react';
import { useSession } from '../context/SessionContext';

/* Applet Imports */
import { ClockApplet } from './panel/systray/applets/ClockApplet';
import { NetworkApplet } from './panel/systray/applets/NetworkApplet';
import { VolumeApplet } from './panel/systray/applets/VolumeApplet';
import { BatteryApplet } from './panel/systray/applets/BatteryApplet';

/* UI Imports */
import { DesktopIcon, type DesktopIconConfig } from './workspace/DesktopIcon';
import { StartMenu } from './panel/StartMenu';

interface DesktopShellProps {
  children?: ReactNode;
}

/**
 * Layer 4: Desktop Shell
 * Responsibility: Renders wallpaper, taskbar, system tray, and desktop workspace icons.
 * Technical: Implements System Z-Layers (Taskbar @ z-900) and Layer Status awareness.
 */
export const DesktopShell = ({ children }: DesktopShellProps) => {
  const { state, logoff, reboot } = useSession();
  const { wallpaper } = state;
  const [activeWindows, setActiveWindows] = useState<any[]>([]);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  /* New: Get operational status for Layer 4 */
  const status = state.layers?.desktopShell || 'active';

  useEffect(() => {
    const syncWindows = (e: Event) => {
      setActiveWindows((e as CustomEvent).detail || []);
    };
    window.addEventListener('dvirtos:window_list_update', syncWindows);
    return () => window.removeEventListener('dvirtos:window_list_update', syncWindows);
  }, []);

  useEffect(() => {
    if (status === 'active') {
      const timer = setTimeout(() => {
        /* Refined: Using the correct binary name discovered by Kernel */
        spawnApp('WelcomeApp');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  /* 
     REFINED: Context Menu Hijacker 
     Ensures the browser's default menu is completely blocked 
  */
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => {
    if (contextMenu) setContextMenu(null);
  };

  const spawnApp = (type: string) => {
    const event = new CustomEvent('dvirtos:spawn_app', { detail: { type } });
    window.dispatchEvent(event);
    closeMenu();
  };

  const openFile = (path: string) => {
    const event = new CustomEvent('dvirtos:open_file', { detail: { path } });
    window.dispatchEvent(event);
  };

  const toggleWindow = (id: string) => {
    const event = new CustomEvent('dvirtos:toggle_window', { detail: { id } });
    window.dispatchEvent(event);
  };

  /* Desktop Icons Configuration Object */
  const desktopIcons: DesktopIconConfig[] = [
    {
      id: 'my-cv',
      label: 'Curriculum.pdf',
      icon: 'bi-file-pdf-fill',
      action: () => openFile('/dvirtos/home/user/Documents/cv.pdf')
    },
    {
      id: 'sys-logoff',
      label: 'Logoff',
      icon: 'bi-box-arrow-left',
      action: () => logoff()
    },
    {
      id: 'sys-reboot',
      label: 'Reboot',
      icon: 'bi-arrow-clockwise',
      action: () => reboot()
    }
  ];

  /* 
     Logic: Terminated Status
     If the layer is terminated, we bypass rendering the UI shell 
     but keep the UserSpace (children) active to avoid breaking the stack.
  */
  if (status === 'terminated') {
    return <div className="h-full w-full bg-transparent">{children}</div>;
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={closeMenu}
      className={`h-full w-full flex flex-col font-ubuntu relative overflow-hidden transition-opacity duration-300
      ${status === 'hidden' ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      cursor-x11-left-ptr /* Corrigido: Mantendo o padrão X11 da simulação */
    `}
      style={{ backgroundColor: '#0A0A0A' }}
    >

      {/* 
          Start Menu Overlay 
          Layer: z-[940] (Below StartMenu @ 950, Above Taskbar @ 900)
      */}
      {isStartMenuOpen && (
        <div
          className="absolute inset-0 z-[940] bg-transparent"
          onClick={() => setIsStartMenuOpen(false)}
        />
      )}

      {/* Start Menu Component (Internal z-index handled in component: z-[950]) */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onSpawnApp={spawnApp}
      />

      {/* Wallpaper Layer (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {wallpaper === 'default' ? (
          <div className="w-full h-full relative opacity-40">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B87C00]/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D0980C]/20 blur-[120px] rounded-full" />
          </div>
        ) : (
          <img
            src={wallpaper}
            className="w-full h-full object-cover transition-opacity duration-1000 animate-fade-in opacity-50"
            alt="Desktop"
          />
        )}

        {/* Watermark */}
        <div className="absolute bottom-20 right-8 text-right opacity-30 select-none">
          <h2 className="text-4xl font-bold text-[#FCF87C] tracking-tighter">D-VirtOS</h2>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E4C844]">
            Kernel: {state.boot.selectedOS} // Layer 4 Environment
          </p>
        </div>
      </div>

      {/* Main Workspace: Desktop Icons Grid & Windows (UserSpace Layer) 
          Layer: z-10 (Windows start at z-100 inside children)
      */}
      <main
        onContextMenu={handleContextMenu}
        className="flex-1 relative z-10 p-6 flex flex-col flex-wrap gap-4 content-start"
      >
        {/* Dynamic Apps from Kernel Discovery (Meta 1) */}
        {state.installedApps && state.installedApps.map(app => (
          <DesktopIcon
            key={app.id}
            config={{
              id: app.id,
              label: app.name,
              icon: app.icon,
              action: () => spawnApp(app.exec) /* Triggers your standard window event */
            }}
          />
        ))}

        {/* Existing Static System Icons */}
        {desktopIcons.map(icon => (
          <DesktopIcon key={icon.id} config={icon} />
        ))}
        {children}
      </main>

      {/* Taskbar (System Dock Layer)
          Layer: z-[900] (Always above apps/windows)
      */}
      <footer

        onContextMenu={(e) => e.stopPropagation()}
        className="h-12 w-full bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/5 flex items-center justify-between px-2 z-[900]"
      >
        <div className="flex items-center gap-2">
          {/* Start Menu Button Trigger */}
          <button
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
            className={`w-9 h-9 rounded flex items-center justify-center transition-all cursor-x11-pointer border
              ${isStartMenuOpen
                ? 'bg-[#E4C844]/30 border-[#E4C844]/60 shadow-[0_0_15px_rgba(228,200,68,0.3)]'
                : 'bg-[#E4C844]/10 border-[#E4C844]/30 hover:bg-[#E4C844]/20'}`}
          >
            {/* System Logo: Ensured fixed dimensions to prevent 0px rendering */}
            <img
              src="/dvirtos/usr/share/icons/dvirtos_logos/dvirtos-logo.svg"
              alt="Start"
              className="w-5 h-5 min-w-[20px] min-h-[20px] object-contain select-none pointer-events-none drop-shadow-[0_0_5px_rgba(252,248,124,0.5)]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.insertAdjacentHTML('afterbegin', '<div class="w-3 h-3 bg-[#FCF87C] rounded-sm"></div>');
              }}
            />
          </button>

          <div className="h-6 w-[1px] bg-white/10 mx-1" />

          <div className="flex items-center gap-1">
            {activeWindows.map(win => (
              <button
                key={win.id}
                onClick={() => toggleWindow(win.id)}
                className={`px-3 h-9 flex items-center gap-2 rounded transition-all border cursor-x11-pointer
                    ${win.isMinimized
                    ? 'bg-transparent border-white/5 opacity-50'
                    : `bg-white/5 border-[#E4C844]/20 shadow-[0_0_10px_rgba(228,200,68,0.1)] ${win.zIndex >= 100 + activeWindows.length - 1 ? 'font-bold' : ''}`}`}
              >
                <i className={`bi ${win.type === 'terminal' ? 'bi-terminal' : 'bi-gear'} text-[14px] ${win.isMinimized ? 'text-white/40' : 'text-[#FCF87C]'}`}></i>
                <span className="text-[10px] text-white/70 uppercase tracking-tighter font-medium max-w-[100px] truncate">
                  {win.title}
                </span>
                {!win.isMinimized && <div className="w-1 h-1 rounded-full bg-[#FCF87C] mt-auto mb-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* System Tray Area */}
        <div className="flex items-center gap-2 px-2">
          <div className="hidden lg:flex items-center gap-1 mr-2">
            <NetworkApplet />
            <VolumeApplet />
            <BatteryApplet />
          </div>
          <ClockApplet />
        </div>
      </footer>

      {/* Layer 4.5: D-VirtOS Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-[960] w-48 bg-[#1A1A1A]/95 backdrop-blur-lg border border-[#FCF87C]/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-1 flex flex-col rounded-md animate-in fade-in-5 zoom-in-95"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          /* Prevent clicks inside the menu from closing itself prematurely */
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button onClick={() => spawnApp('terminal')} className="px-3 py-2 text-left text-[11px] text-white/70 hover:bg-[#E4C844]/20 hover:text-white flex items-center gap-2 transition-colors">
            <i className="bi bi-terminal-fill text-[#FCF87C]"></i> OPEN TERMINAL
          </button>
          <button onClick={() => spawnApp('settings')} className="px-3 py-2 text-left text-[11px] text-white/70 hover:bg-[#E4C844]/20 hover:text-white flex items-center gap-2 transition-colors">
            <i className="bi bi-gear-fill text-[#FCF87C]"></i> DESKTOP SETTINGS
          </button>
          <div className="h-[1px] bg-white/5 my-1 mx-2" />
          <button onClick={reboot} className="px-3 py-2 text-left text-[11px] text-white/70 hover:bg-[#E4C844]/20 hover:text-white flex items-center gap-2 cursor-x11-pointer">
            <i className="bi bi-arrow-clockwise"></i> REBOOT SYSTEM
          </button>
          <button onClick={logoff} className="px-3 py-2 text-left text-[11px] text-white/70 hover:bg-red-500/20 hover:text-red-400 flex items-center gap-2 cursor-x11-pointer">
            <i className="bi bi-power"></i> LOGOFF
          </button>
        </div>
      )}
    </div>
  );
};