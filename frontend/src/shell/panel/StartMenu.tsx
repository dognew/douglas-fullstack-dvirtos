import { useState } from "react";
import { useSession } from "../../context/SessionContext";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSpawnApp: (type: string) => void;
}

export const StartMenu = ({ isOpen, onClose, onSpawnApp }: StartMenuProps) => {
  const { state, logoff, reboot } = useSession();
  const { installedApps } = state;
  
  // New: State for category filtering
  const [activeCategory, setActiveCategory] = useState('All Applications');

  if (!isOpen) return null;

  // Categories list based on your system design
  const categories = ['All Applications', 'Accessories', 'Graphics', 'Internet', 'Office', 'System'];

  // Refined: Filtering logic based on real JSON data
  const filteredApps = installedApps?.filter(app => {
    if (activeCategory === 'All Applications') return true;
    
    // Fallback logic: if category is missing in JSON, treat as 'System' or 'Accessories'
    const appCategory = app.category || 'System'; 
    return appCategory.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div 
      onContextMenu={(e) => e.stopPropagation()}
      className="absolute bottom-14 left-2 w-[520px] h-[450px] bg-[#1A1A1A]/95 backdrop-blur-xl 
                 border border-white/10 rounded-lg shadow-2xl z-[950] flex overflow-hidden 
                 animate-in slide-in-from-bottom-4 duration-200"
    >
      {/* Sidebar: Quick Actions & Power */}
      <aside className="w-12 bg-black/20 border-r border-white/5 flex flex-col items-center py-4 justify-between">
        <div className="flex flex-col gap-4 text-white/40">
           {/* FIX: Browser Shortcut integration */}
           <i 
             className="bi bi-browser-chrome hover:text-[#FCF87C] cursor-x11-pointer transition-colors"
             title="Web Browser"
             onClick={() => { onSpawnApp('BrowserWeb'); onClose(); }}
           ></i>
           <i 
             className="bi bi-terminal-fill hover:text-[#FCF87C] cursor-x11-pointer transition-colors"
             onClick={() => { onSpawnApp('TerminalTest'); onClose(); }}
           ></i>
           <i className="bi bi-folder-fill hover:text-[#FCF87C] cursor-x11-pointer transition-colors"></i>
        </div>

        <div className="flex flex-col gap-4 text-white/40">
           <i className="bi bi-arrow-clockwise hover:text-[#FCF87C] cursor-x11-pointer transition-colors" onClick={reboot}></i>
           <i className="bi bi-power hover:text-red-500 cursor-x11-pointer transition-colors" onClick={logoff}></i>
        </div>
      </aside>

      <section className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="p-4">
           <div className="relative">
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs"></i>
              <input 
                type="text"
                placeholder="Search Applications..."
                className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 
                           text-[11px] text-white/80 placeholder:text-white/20 outline-none
                           focus:border-[#FCF87C]/30 transition-all"
                autoFocus
              />
           </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
           {/* Categories: Now with active state control */}
           <div className="w-32 py-2 border-r border-white/5 overflow-y-auto">
              {categories.map((cat) => (
                <div 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[10px] cursor-x11-pointer transition-colors
                    ${activeCategory === cat ? 'bg-[#FCF87C]/10 text-[#FCF87C]' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}
                >
                  {cat}
                </div>
              ))}
           </div>

           {/* App Grid: Filtered by Category */}
           <div className="flex-1 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-1">
              {filteredApps && filteredApps.map(app => (
                <button 
                  key={app.id}
                  onClick={() => { onSpawnApp(app.exec); onClose(); }}
                  className="flex items-center gap-3 p-2 rounded hover:bg-white/5 group transition-all text-left cursor-x11-pointer"
                >
                   <div className="w-8 h-8 bg-[#E4C844]/10 rounded flex items-center justify-center border border-[#E4C844]/20 overflow-hidden">
                      {app.icon.includes('/') ? (
                        <img src={app.icon} alt={app.name} className="w-5 h-5 object-contain" />
                      ) : (
                        <i className={`bi ${app.icon} text-[#FCF87C]`}></i>
                      )}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[11px] text-white/80 group-hover:text-[#FCF87C]">{app.name}</span>
                      <span className="text-[9px] text-white/30 lowercase truncate max-w-[200px]">
                        {app.description}
                      </span>
                   </div>
                </button>
              ))}

              {filteredApps?.length === 0 && (
                <div className="p-4 text-center text-[10px] text-white/20 italic">
                  No applications in this category.
                </div>
              )}
           </div>
        </div>
      </section>
    </div>
  );
};