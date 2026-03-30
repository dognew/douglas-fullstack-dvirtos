import { type ReactNode, useState, useEffect } from 'react';
import { useSession } from '../../../context/SessionContext';

interface DesktopShellProps {
  children?: ReactNode;
}

/**
 * Layer 4: Desktop Shell (KDE-style Taskbar implementation)
 * Responsibility: Manages dynamic app buttons based on Layer 3 state.
 */
export const DesktopShell = ({ children }: DesktopShellProps) => {
  const { state, logoff, reboot } = useSession();
  const { selectedOS } = state.boot;
  const [activeWindows, setActiveWindows] = useState<any[]>([]);

  /**
   * Monitor window list updates from Layer 3 (Window Manager)
   */
  useEffect(() => {
    const syncWindows = (e: Event) => {
      setActiveWindows((e as CustomEvent).detail || []);
    };
    window.addEventListener('dvirtos:window_list_update', syncWindows);
    return () => window.removeEventListener('dvirtos:window_list_update', syncWindows);
  }, []);

  /**
   * Sends a signal to Window Manager to toggle minimize/restore state
   */
  const toggleWindow = (id: string) => {
    const event = new CustomEvent('dvirtos:toggle_window', { detail: { id } });
    window.dispatchEvent(event);
  };

  return (
    <div className="h-full w-full flex flex-col font-ubuntu relative overflow-hidden bg-[#0A0A0A] cursor-x11-left-ptr">
      {/* Wallpaper Layer with dynamic system info */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B87C00]/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D0980C]/20 blur-[120px] rounded-full" />
         
         {/* System Info Watermark (Reads selectedOS) */}
         <div className="absolute bottom-20 right-8 text-right opacity-30 select-none">
            <h2 className="text-4xl font-bold text-[#FCF87C] tracking-tighter">D-VirtOS</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E4C844]">
              Kernel: {selectedOS} // Layer 4 Environment
            </p>
         </div>
      </div>

      {/* Main Workspace for Layer 5 Applications */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Taskbar (KDE / Docker style) */}
      <footer className="h-12 w-full bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/5 flex items-center justify-between px-2 z-50">
        <div className="flex items-center gap-2">
          {/* Start Menu Button Trigger */}
          <button className="w-9 h-9 rounded bg-[#E4C844]/10 border border-[#E4C844]/30 flex items-center justify-center hover:bg-[#E4C844]/20 transition-all cursor-x11-pointer">
            <div className="w-3 h-3 bg-[#FCF87C] rounded-sm shadow-[0_0_8px_#FCF87C]" />
          </button>
          
          <div className="h-6 w-[1px] bg-white/10 mx-1" />
          
          {/* Dynamic Task Manager - Only shows icons for active processes */}
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

        {/* System Tray & Real-time Clock */}
        <div className="flex items-center gap-4 px-2">
           <div className="hidden md:flex gap-3 text-[9px] font-mono text-white/30 tracking-widest mr-4">
              <button onClick={logoff} className="hover:text-white transition-colors cursor-x11-pointer uppercase">Logoff</button>
              <button onClick={reboot} className="hover:text-red-500 transition-colors cursor-x11-pointer uppercase">Reboot</button>
           </div>
           <div className="text-right border-l border-white/5 pl-4">
              <p className="text-white/80 text-[11px] font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
           </div>
        </div>
      </footer>
    </div>
  );
};