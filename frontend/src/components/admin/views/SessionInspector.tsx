import { useSession, type LayerStatus } from '../../../context/SessionContext';

/**
 * Admin View: Session Inspector (V2 - Restored & Enhanced)
 * Responsibility: Real-time layer control (Kill/Hide) AND full session data inspection.
 */
export const SessionInspector = () => {
  const { state, setLayerStatus } = useSession();

  /* Hierarchy with margin-left mapping for visual nesting */
  const layerControls: { id: 'xserver' | 'windowManager' | 'desktopShell'; name: string; ml: string; parent?: string }[] = [
    { id: 'xserver', name: 'X11 Server (Layer 1)', ml: 'ml-0' },
    { id: 'windowManager', name: 'Window Manager (Layer 3)', ml: 'ml-4', parent: 'xserver' },
    { id: 'desktopShell', name: 'Desktop Shell (Layer 4)', ml: 'ml-8', parent: 'windowManager' }
  ];

  /**
   * Restored: Original Export functionality
   * Exports the ENTIRE session state as a JSON file.
   */
  const exportSessionData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dvirtos-kernel-dump-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSpawn = (layerId: any, parentId?: string) => {
    if (parentId && state.layers?.[parentId as keyof typeof state.layers] !== 'active') {
      alert(`CRITICAL: Dependency Failure. Parent [${parentId}] must be ACTIVE to spawn child.`);
      return;
    }
    setLayerStatus(layerId, 'active');
  };

  return (
    <div className="flex flex-col h-full space-y-4 font-mono">
      {/* Header Bar with Action */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[#E4C844] uppercase text-sm tracking-tighter">/proc/layer_control</h3>
        <button 
          onClick={exportSessionData}
          className="px-3 py-1 bg-[#E4C844] text-black text-[10px] font-bold uppercase hover:bg-white transition-colors"
        >
          Export JSON
        </button>
      </div>

      {/* Layer Controllers (The Nesting Hierarchy) */}
      <div className="flex flex-col gap-2">
        {layerControls.map(layer => {
          const currentStatus: LayerStatus = state.layers?.[layer.id] || 'active';
          const isTerminated = currentStatus === 'terminated';
          
          return (
            <div 
              key={layer.id} 
              className={`bg-white/5 border border-white/10 p-3 rounded flex items-center justify-between transition-all ${layer.ml}`}
            >
              <div>
                <div className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">
                  {layer.name}
                </div>
                <div className={`text-[10px] ${isTerminated ? 'text-red-600' : currentStatus === 'hidden' ? 'text-orange-400' : 'text-green-500'}`}>
                  STATUS: {currentStatus.toUpperCase()}
                </div>
              </div>
              
              <div className="flex gap-1">
                {!isTerminated ? (
                  <>
                    <button 
                      onClick={() => setLayerStatus(layer.id, currentStatus === 'hidden' ? 'active' : 'hidden')}
                      className="px-2 py-1 border border-white/20 text-[9px] uppercase hover:bg-white/10 text-white/70"
                    >
                      {currentStatus === 'hidden' ? 'Show' : 'Hide'}
                    </button>
                    <button 
                      onClick={() => setLayerStatus(layer.id, 'terminated')}
                      className="px-2 py-1 bg-red-900/40 border border-red-500/50 text-[9px] uppercase hover:bg-red-600 text-white"
                    >
                      Kill
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleSpawn(layer.id, layer.parent)}
                    className="px-4 py-1 bg-[#FCF87C]/20 border border-[#FCF87C]/50 text-[9px] text-[#FCF87C] uppercase hover:bg-[#FCF87C]/40"
                  >
                    Spawn Layer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Restored: Full Session Terminal (The original "Super Power") */}
      <div className="flex-1 bg-black/40 border border-white/10 p-4 rounded overflow-hidden flex flex-col">
        <div className="text-[10px] text-white/20 uppercase mb-2 tracking-widest">
          Kernel Message Bus (Full Session State)
        </div>
        <pre className="flex-1 overflow-auto text-[11px] text-green-500 leading-relaxed custom-scrollbar selection:bg-green-500/20">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  );
};