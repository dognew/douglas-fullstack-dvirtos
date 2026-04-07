import { useState, useEffect } from 'react';
import { Window } from '../../system/window/Window';
import { useSession } from '../../context/SessionContext';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { date: string; name: string };
  };
}

/**
 * App: System Information (v1.0.0)
 * Responsibility: Control center for hardware specs, system updates, and manifest information.
 * Refined: Added 'About App' tab and fixed minimization bridge.
 */
const SystemInfo = ({ 
  onClose, 
  onMinimize, 
  isMinimized, 
  zIndex 
}: { 
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  zIndex: number;
}) => {
  const { state } = useSession();
  const { specs, loading: hwLoading } = state.hardware; 
  const [activeTab, setActiveTab] = useState<'about' | 'hardware' | 'updates' | 'app_info'>('about');
  
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const tabs = [
    { id: 'about', label: 'Summary', icon: 'bi-info-circle' },
    { id: 'hardware', label: 'Hardware', icon: 'bi-cpu' },
    { id: 'updates', label: 'Updates', icon: 'bi-arrow-repeat' },
    { id: 'app_info', label: 'About', icon: 'bi-patch-check' },
  ];

  useEffect(() => {
    if (activeTab === 'updates' && commits.length === 0) {
      fetchCommits();
    }
  }, [activeTab, commits.length]);

  const fetchCommits = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('https://api.github.com/repos/dognew/douglas-fullstack-dvirtos/commits?per_page=5');
      const data = await response.json();
      if (Array.isArray(data)) setCommits(data);
    } catch (error) {
      console.error("[System] Failed to sync with repository", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Window 
      title="System Information" 
      initialW={650} 
      initialH={450} 
      onClose={onClose} 
      onMinimize={onMinimize}
      isMinimized={isMinimized}
      zIndex={zIndex}
    >
      <div className="flex h-full bg-[#0D0D0D] overflow-hidden rounded-md border border-white/5 font-ubuntu">
        <aside className="w-40 bg-black/40 border-r border-white/5 flex flex-col py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-wider transition-all
                ${activeTab === tab.id 
                  ? 'bg-[#FCF87C]/10 text-[#FCF87C] border-r-2 border-[#FCF87C]' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}
            >
              <i className={`bi ${tab.icon} text-xs`}></i>
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar select-text">
          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <header className="flex items-center gap-4 border-b border-white/10 pb-4">
                <img src="/dvirtos/usr/share/icons/dvirtos_logos/dvirtos-logo.svg" className="w-12 h-12" alt="OS Logo" />
                <div>
                  <h2 className="text-xl font-bold text-[#FCF87C] tracking-tighter">D-VirtOS</h2>
                  <p className="text-[9px] text-white/30 uppercase">Version 1.0.0 // Stable Kernel</p>
                </div>
              </header>
              <article className="space-y-4 text-[11px] leading-relaxed text-white/70">
                <p><span className="text-[#FCF87C] font-bold">D-VirtOS</span> is a technical manifesto and living portfolio.</p>
                <p>The core objective is to demonstrate advanced software engineering principles.</p>
                <div className="pt-4 flex gap-4">
                   <a href="https://github.com/dognew/douglas-fullstack-dvirtos" target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 text-[#FCF87C]">
                    <i className="bi bi-github"></i> VIEW SOURCE CODE
                   </a>
                </div>
              </article>
            </div>
          )}

          {activeTab === 'hardware' && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
               <h3 className="text-[#FCF87C] text-[10px] uppercase font-bold tracking-widest mb-4">Hardware Specifications</h3>
               {hwLoading ? (
                 <div className="text-[10px] animate-pulse">Scanning system bus...</div>
               ) : (
                 <div className="grid gap-2 text-[10px]">
                    <div className="bg-white/5 p-3 border border-white/5 rounded flex justify-between">
                      <span className="text-white/40 uppercase">Processor</span>
                      <span className="text-white/90">{specs?.cpu || 'Generic CPU'}</span>
                    </div>
                    <div className="bg-white/5 p-3 border border-white/5 rounded flex justify-between">
                      <span className="text-white/40 uppercase">Physical Memory</span>
                      <span className="text-white/90">{specs?.ram || '0 GB'}</span>
                    </div>
                    <div className="bg-white/5 p-3 border border-white/5 rounded flex justify-between">
                      <span className="text-white/40 uppercase">Mainboard</span>
                      <span className="text-white/90">{specs?.motherboard || 'INTEL X99'}</span>
                    </div>
                    <div className="bg-white/5 p-3 border border-white/5 rounded flex justify-between">
                      <span className="text-white/40 uppercase">Storage Device</span>
                      <span className="text-white/90">{specs?.storage || 'NVMe SSD'}</span>
                    </div>
                 </div>
               )}
               <p className="text-[9px] text-white/20 italic pt-4">* Data synchronized with Megabios kernel detection.</p>
            </div>
          )}

          {activeTab === 'updates' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
               <h3 className="text-[#FCF87C] text-[10px] uppercase font-bold tracking-widest mb-4">System Updates</h3>
               <div className="bg-white/5 border border-white/10 rounded-md p-6 flex flex-col items-center text-center mb-6">
                 <i className={`bi ${isUpdating ? 'bi-arrow-repeat animate-spin' : 'bi-check-circle'} text-3xl ${isUpdating ? 'text-[#FCF87C]' : 'text-lime-400'} mb-3`}></i>
                 <p className="text-[12px] text-white/90 font-bold mb-1">{isUpdating ? 'Synchronizing...' : 'System is up to date'}</p>
                 <p className="text-[9px] text-white/40 uppercase tracking-widest">LATEST KERNEL STABLE BUILD</p>
               </div>
               <div className="space-y-3">
                 <h4 className="text-[9px] text-white/30 uppercase tracking-[0.2em] mb-2">Recent Changelog</h4>
                 {commits.map((c) => {
                   const [title, ...bodyParts] = c.commit.message.split('\n');
                   const body = bodyParts.join('\n').trim();
                   return (
                     <div key={c.sha} className="group border-l-2 border-white/10 hover:border-[#FCF87C]/50 pl-4 py-2 transition-all">
                       <p className="text-[11px] text-white/90 font-bold group-hover:text-[#FCF87C] leading-snug">{title}</p>
                       {body && <p className="text-[10px] text-white/40 mt-1 whitespace-pre-wrap leading-relaxed">{body}</p>}
                       <div className="flex gap-3 mt-2">
                          <span className="text-[9px] font-mono text-[#E4C844] bg-[#E4C844]/5 px-1 rounded">{c.sha.substring(0, 7)}</span>
                          <span className="text-[9px] text-white/20 uppercase tracking-tighter">{new Date(c.commit.author.date).toLocaleDateString()}</span>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          )}

          {activeTab === 'app_info' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300 h-full flex flex-col">
               <h3 className="text-[#FCF87C] text-[10px] uppercase font-bold tracking-widest mb-4">About System Information</h3>
               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 border border-white/5 rounded-lg bg-white/[0.02]">
                  <i className="bi bi-patch-check text-5xl text-[#FCF87C]/20"></i>
                  <div>
                    <p className="text-white text-sm font-bold">System Information App</p>
                    <p className="text-[10px] text-white/40">Version 1.0.0 (Stable)</p>
                  </div>
                  <p className="max-w-xs text-[11px] text-white/60 leading-relaxed">
                    Developed by Douglas Fiedler to provide transparency and hardware abstraction within the D-VirtOS environment.
                  </p>
               </div>
               <p className="text-[9px] text-white/20 text-center font-mono">Build: Stable-v1.0_2026</p>
            </div>
          )}
        </main>
      </div>
    </Window>
  );
};

export default SystemInfo;