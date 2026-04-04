import { useState } from 'react';
import { SessionInspector } from './painel/SessionInspector';

interface AdminShellProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminView = 'session_manager' | 'processes' | 'hardware';

export const AdminShell = ({ isOpen, onClose }: AdminShellProps) => {
  const [activeView, setActiveView] = useState<AdminView>('session_manager');

  /**
   * Emits a system-wide signal to spawn an application in the Window Manager
   */
  const emitSpawnSignal = (appType: string) => {
    const event = new CustomEvent('dvirtos:spawn_app', { detail: { type: appType } });
    window.dispatchEvent(event);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-ubuntu">
      <div className="w-full max-w-4xl h-[500px] bg-[#1a1a1a] border border-[#E4C844]/30 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header bar */}
        <div className="h-10 bg-[#0a0a0a] border-b border-white/10 flex justify-between items-center px-4">
          <span className="text-[11px] font-mono text-white/50 tracking-widest uppercase">
            D-VirtOS System Administration Panel
          </span>
          <button onClick={onClose} className="text-white/40 hover:text-red-500 transition-colors">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-[#0f0f0f] border-r border-white/5 p-2 space-y-1">
            <button 
              onClick={() => setActiveView('session_manager')}
              className={`w-full text-left px-3 py-2 text-[10px] font-mono uppercase transition-all ${
                activeView === 'session_manager' ? 'bg-[#E4C844] text-black' : 'text-white/40 hover:bg-white/5'
              }`}
            >
              <i className="bi bi-database-fill mr-2"></i> session_manager
            </button>
            <button 
              onClick={() => setActiveView('processes')}
              className={`w-full text-left px-3 py-2 text-[10px] font-mono uppercase transition-all ${
                activeView === 'processes' ? 'bg-[#E4C844] text-black' : 'text-white/40 hover:bg-white/5'
              }`}
            >
              <i className="bi bi-cpu-fill mr-2"></i> process_spawner
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 bg-[#121212] overflow-auto">
            {activeView === 'session_manager' && <SessionInspector />}
            
            {activeView === 'processes' && (
              <div className="space-y-4">
                <h3 className="text-[#E4C844] text-xs font-mono uppercase border-b border-white/5 pb-2">Available Binaries</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => emitSpawnSignal('terminal')}
                    className="p-4 border border-white/10 bg-white/5 hover:bg-[#E4C844]/10 hover:border-[#E4C844]/50 transition-all text-left group"
                  >
                    <div className="text-[#E4C844] mb-1 font-mono text-xs tracking-tighter">/usr/bin/terminal</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest group-hover:text-white/60">Spawn New Instance</div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};