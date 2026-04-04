export default function ExitModal({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      
      <div className="bg-gray-400 border-4 border-white p-6 text-[#0000AA] shadow-[10px_10px_0px_rgba(0,0,0,0.5)]">
        <h2 className="font-bold border-b border-[#0000AA] mb-6 px-4 text-center">
          SAVE CONFIGURATION AND EXIT?
        </h2>
        
        <div className="flex justify-center gap-10 font-bold">
          <button 
            onClick={onConfirm} 
            className="bg-gray-300 border-2 border-gray-500 px-6 py-1 hover:bg-[#0000AA] hover:text-white transition-colors shadow-sm"
          >
            [ YES ]
          </button>
          
          <button 
            onClick={onCancel} 
            className="bg-gray-300 border-2 border-gray-500 px-6 py-1 hover:bg-[#0000AA] hover:text-white transition-colors shadow-sm"
          >
            [ NO ]
          </button>
        </div>
      </div>
    </div>
  );
}