import { type ReactNode } from 'react';
import { useSession } from '../../../context/SessionContext';

interface DesktopShellProps {
  children?: ReactNode;
}

/**
 * Layer 4: Desktop Shell
 * Responsibility: Renders the wallpaper, system status, and acts as a container for user applications.
 */
export const DesktopShell = ({ children }: DesktopShellProps) => {
  const { state, logoff, reboot } = useSession();
  const { selectedOS } = state.boot;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center font-ubuntu relative">
      <div className="z-10 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-[#FCF87C] drop-shadow-[0_0_20px_rgba(228,200,68,0.3)] tracking-tighter">
            D-VirtOS
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#E4C844] to-transparent mx-auto" />
        </div>

        <p className="text-[#E4C844]/60 font-mono tracking-[0.5em] uppercase text-[10px] animate-pulse">
          X11 Server Initialized: {selectedOS}
        </p>

        <div className="flex gap-4 justify-center mt-12">
          <button 
            onClick={logoff} 
            className="px-6 py-2 border border-[#B87C00]/40 text-[#B87C00] hover:bg-[#FCF87C] hover:text-black transition-all duration-500 text-xs tracking-widest uppercase rounded-full flex items-center gap-2 cursor-x11-click"
          >
            <i className="bi bi-box-arrow-right"></i> Logoff
          </button>
          <button 
            onClick={reboot} 
            className="px-6 py-2 border border-red-900/40 text-red-500/70 hover:bg-red-700 hover:text-white transition-all duration-500 text-xs tracking-widest uppercase rounded-full flex items-center gap-2 cursor-x11-click"
          >
            <i className="bi bi-arrow-clockwise"></i> Reboot
          </button>
        </div>
      </div>

      {/* Children will be the windows managed by Layer 3 */}
      {children}

      {/* Decorative backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B87C00]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D0980C]/50 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};