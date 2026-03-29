import { useState } from 'react';
import { SessionInspector } from './views/SessionInspector';

interface AdminShellProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminView = 'session_manager' | 'hardware' | 'logs';

export const AdminShell = ({ isOpen, onClose }: AdminShellProps) => {
  const [activeView, setActiveView] = useState<AdminView>('session_manager');

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
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 bg-[#121212] overflow-auto">
            {activeView === 'session_manager' && <SessionInspector />}
          </div>
        </div>
      </div>
    </div>
  );
};