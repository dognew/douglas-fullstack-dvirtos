import { type ReactNode, useState, useEffect } from 'react';
import { useSession } from '../../../context/SessionContext';

/* Applet Imports */
import { ClockApplet } from './shell/applets/ClockApplet';
import { NetworkApplet } from './shell/applets/NetworkApplet';
import { VolumeApplet } from './shell/applets/VolumeApplet';
import { BatteryApplet } from './shell/applets/BatteryApplet';

/* UI Imports */
import { DesktopIcon, type DesktopIconConfig } from './shell/DesktopIcon';

interface DesktopShellProps {
  children?: ReactNode;
}

/**
 * Layer 4: Desktop Shell
 * Responsibility: Renders wallpaper, taskbar, system tray, and desktop workspace icons.
 */
export const DesktopShell = ({ children }: DesktopShellProps) => {
  const { state, logoff, reboot } = useSession();
  const { selectedOS } = state.boot;
  const [activeWindows, setActiveWindows] = useState<any[]>([]);

  useEffect(() => {
    const syncWindows = (e: Event) => {
      setActiveWindows((e as CustomEvent).detail || []);
    };
    window.addEventListener('dvirtos:window_list_update', syncWindows);
    return () => window.removeEventListener('dvirtos:window_list_update', syncWindows);
  }, []);

  const spawnApp = (type: string) => {
    const event = new CustomEvent('dvirtos:spawn_app', { detail: { type } });
    window.dispatchEvent(event);
  };

  const toggleWindow = (id: string) => {
    const event = new CustomEvent('dvirtos:toggle_window', { detail: { id } });
    window.dispatchEvent(event);
  };

  /* Desktop Icons Configuration Object */
  const desktopIcons: DesktopIconConfig[] = [
    { 
      id: 'term-launcher', 
      label: 'Terminal', 
      icon: 'bi-terminal-fill', 
      action: () => spawnApp('terminal') 
    },
    { 
      id: 'sys-info', 
      label: 'System Info', 
      icon: 'bi-info-square-fill', 
      action: () => console.log('System Info Triggered') 
    }
  ];

  return (
    <div className="h-full w-full flex flex-col font-ubuntu relative overflow-hidden bg-[#0A0A0A] cursor-x11-left-ptr">
      {/* Wallpaper Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B87C00]/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D0980C]/20 blur-[120px] rounded-full" />
         
         <div className="absolute bottom-20 right-8 text-right opacity-30 select-none">
            <h2 className="text-4xl font-bold text-[#FCF87C] tracking-tighter">D-VirtOS</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E4C844]">
              Kernel: {selectedOS} // Layer 4 Environment
            </p>
         </div>
      </div>

      {/* Main Workspace: Desktop Icons Grid & Windows */}
      <main className="flex-1 relative z-10 p-6 flex flex-col flex-wrap gap-4 content-start">
        {/* Render Desktop Icons from Object List */}
        {desktopIcons.map(icon => (
          <DesktopIcon key={icon.id} config={icon} />
        ))}

        {/* User Space Windows (Layer 5) */}
        {children}
      </main>

      {/* Taskbar */}
      <footer className="h-12 w-full bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/5 flex items-center justify-between px-2 z-50">
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded bg-[#E4C844]/10 border border-[#E4C844]/30 flex items-center justify-center hover:bg-[#E4C844]/20 transition-all cursor-x11-pointer">
            <div className="w-3 h-3 bg-[#FCF87C] rounded-sm shadow-[0_0_8px_#FCF87C]" />
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
                      : 'bg-white/5 border-[#E4C844]/20 shadow-[0_0_10px_rgba(228,200,68,0.1)]'}`}
                >
                  <i className={`bi bi-terminal text-[14px] ${win.isMinimized ? 'text-white/40' : 'text-[#FCF87C]'}`}></i>
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

           <div className="hidden md:flex gap-3 text-[9px] font-mono text-white/30 tracking-widest mr-4">
              <button onClick={logoff} className="hover:text-white transition-colors cursor-x11-pointer uppercase">Logoff</button>
              <button onClick={reboot} className="hover:text-red-500 transition-colors cursor-x11-pointer uppercase">Reboot</button>
           </div>
           
           <ClockApplet />
        </div>
      </footer>
    </div>
  );
};