import { useSession } from '../../../context/SessionContext';

export const SessionInspector = () => {
  const { state } = useSession();

  const exportSessionData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dvirtos-session-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[#E4C844] font-mono uppercase text-sm">/proc/session_manager</h3>
        <button 
          onClick={exportSessionData}
          className="px-3 py-1 bg-[#E4C844] text-black text-[10px] font-bold uppercase hover:bg-white transition-colors"
        >
          Export JSON
        </button>
      </div>

      <div className="flex-1 bg-black/40 border border-white/10 p-4 rounded overflow-hidden flex flex-col">
        <pre className="flex-1 overflow-auto text-[11px] text-green-500 font-mono leading-relaxed custom-scrollbar">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  );
};