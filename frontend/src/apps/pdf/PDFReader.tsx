import { Window } from '../../system/window/Window';

/**
 * App: PDF Reader (v1.1.0)
 * Responsibility: Dynamic PDF visualization. 
 * Refined: Added 'Empty State' for application-only launching.
 */
const PDFReader = ({ 
  onClose, 
  onMinimize, 
  isMinimized, 
  zIndex,
  file 
}: { 
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  zIndex: number;
  file?: string;
}) => {
  // Now we don't force a fallback here
  const fileUrl = file;

  return (
    <Window 
      title={fileUrl ? `PDF Viewer - ${fileUrl.split('/').pop()}` : "PDF Reader"} 
      initialW={800} 
      initialH={600} 
      onClose={onClose} 
      onMinimize={onMinimize}
      isMinimized={isMinimized}
      zIndex={zIndex}
    >
      <div className="h-full w-full bg-[#1A1A1A] overflow-hidden rounded-sm flex items-center justify-center">
        {fileUrl ? (
          /* Render PDF if file is provided */
          <object
            data={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            type="application/pdf"
            className="w-full h-full border-none"
          >
            <div className="text-white/50 text-[10px] uppercase font-mono">
              Plugin Error. <a href={fileUrl} target="_blank" rel="noreferrer" className="text-[#FCF87C]">Open PDF</a>
            </div>
          </object>
        ) : (
          /* Empty State: Shown when app is opened without a file */
          <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <i className="bi bi-file-earmark-pdf text-6xl text-white/10"></i>
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">PDF Reader v1.1</p>
              <p className="text-white/20 text-[10px] mt-1">NO DOCUMENT LOADED</p>
            </div>
            <p className="text-white/30 text-[9px] max-w-[200px] leading-relaxed mx-auto">
              Please select a .pdf file from the file system or use a direct link to begin viewing.
            </p>
          </div>
        )}
      </div>
    </Window>
  );
};

export default PDFReader;