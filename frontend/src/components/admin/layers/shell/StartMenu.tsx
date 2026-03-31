import { useSession } from '../../../../context/SessionContext';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSpawnApp: (type: string) => void;
}

/**
 * StartMenu Component (Linux Mint / Cinnamon Style)
 * Responsibility: Application launcher with categories and session controls.
 */
export const StartMenu = ({ isOpen, onClose, onSpawnApp }: StartMenuProps) => {
  const { logoff, reboot } = useSession();

  if (!isOpen) return null;

  return (
    <div 
      className="absolute bottom-14 left-2 w-[520px] h-[450px] bg-[#1A1A1A]/95 backdrop-blur-xl 
                 border border-white/10 rounded-lg shadow-2xl z-[60] flex overflow-hidden 
                 animate-in slide-in-from-bottom-4 duration-200"
    >
      {/* Sidebar: Quick Actions & Power */}
      <aside className="w-12 bg-black/20 border-r border-white/5 flex flex-col items-center py-4 justify-between">
        <div className="flex flex-col gap-4 text-white/40">
           <i className="bi bi-browser-chrome hover:text-[#FCF87C] cursor-x11-pointer transition-colors"></i>
           <i 
             className="bi bi-terminal-fill hover:text-[#FCF87C] cursor-x11-pointer transition-colors"
             onClick={() => { onSpawnApp('terminal'); onClose(); }}
           ></i>
           <i className="bi bi-folder-fill hover:text-[#FCF87C] cursor-x11-pointer transition-colors"></i>
        </div>

        <div className="flex flex-col gap-4 mb-2">
           <button onClick={logoff} title="Logoff" className="text-white/40 hover:text-orange-400 transition-colors cursor-x11-pointer">
              <i className="bi bi-box-arrow-left text-lg"></i>
           </button>
           <button onClick={reboot} title="Reboot" className="text-white/40 hover:text-red-500 transition-colors cursor-x11-pointer">
              <i className="bi bi-power text-lg"></i>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col p-3">
        {/* Search Bar */}
        <div className="relative mb-3">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs text-white/80 outline-none focus:border-[#E4C844]/50 transition-all"
            autoFocus
          />
          <i className="bi bi-search absolute right-3 top-2 text-white/20 text-[10px]"></i>
        </div>

        <div className="flex flex-1 gap-4 overflow-hidden">
           {/* Categories Column */}
           <nav className="w-32 flex flex-col gap-0.5 border-r border-white/5 pr-2 overflow-y-auto">
              {['All Applications', 'Accessories', 'Graphics', 'Internet', 'Office', 'Administration', 'Preferences'].map((cat, idx) => (
                <div 
                  key={cat} 
                  className={`px-2 py-1.5 rounded text-[10px] uppercase tracking-tight cursor-x11-pointer transition-all
                             ${idx === 0 ? 'bg-[#E4C844]/10 text-[#FCF87C]' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}
                >
                  {cat}
                </div>
              ))}
           </nav>

           {/* App List Column */}
           <div className="flex-1 overflow-y-auto grid grid-cols-1 content-start gap-1 pr-1">
              {/* Symbolic Apps */}
              <button 
                onClick={() => { onSpawnApp('terminal'); onClose(); }}
                className="flex items-center gap-3 p-2 rounded hover:bg-white/5 group transition-all text-left cursor-x11-pointer"
              >
                 <div className="w-8 h-8 bg-[#E4C844]/10 rounded flex items-center justify-center border border-[#E4C844]/20">
                    <i className="bi bi-terminal-fill text-[#FCF87C]"></i>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[11px] text-white/80 group-hover:text-[#FCF87C]">Terminal</span>
                    <span className="text-[9px] text-white/30 lowercase">System Command Line</span>
                 </div>
              </button>

              {['File Manager', 'System Monitor', 'Calculator', 'Text Editor', 'Web Browser'].map(app => (
                <button key={app} className="flex items-center gap-3 p-2 rounded opacity-50 grayscale hover:grayscale-0 hover:bg-white/5 transition-all text-left cursor-x11-pointer">
                   <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center border border-white/10">
                      <i className="bi bi-app text-white/40"></i>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[11px] text-white/60">{app}</span>
                      <span className="text-[9px] text-white/20 uppercase tracking-tighter italic">Application Symbol</span>
                   </div>
                </button>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};