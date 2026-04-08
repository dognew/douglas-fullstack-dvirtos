import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Window } from '../../system/window/Window';

/**
 * App: BrowserWeb (v1.1.1)
 * Refined: Added native padding property to fix UI clipping.
 */
const BrowserWeb = ({ 
  onClose, 
  onMinimize, 
  isMinimized, 
  zIndex,
  url 
}: { 
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  zIndex: number;
  url?: string;
}) => {
  const defaultUrl = "about:blank"; 
  const [currentUrl, setCurrentUrl] = useState(url || defaultUrl);
  const [inputValue, setInputValue] = useState(url || defaultUrl);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (url) {
      setCurrentUrl(url);
      setInputValue(url);
    }
  }, [url]);

  const handleNavigate = (e: FormEvent) => {
    e.preventDefault();
    let target = inputValue.trim();
    if (!target || target === 'about:blank') {
      setCurrentUrl('about:blank');
      return;
    }
    
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`;
    }
    
    setIsLoading(true);
    setCurrentUrl(target);
    setInputValue(target);
  };

  const goBack = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.history.back();
      } catch (e) {
        console.warn("[BrowserWeb] External domain history is restricted by CORS.");
      }
    }
  };

  const reload = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      const temp = currentUrl;
      setCurrentUrl("about:blank"); 
      setTimeout(() => setCurrentUrl(temp), 50);
    }
  };

  return (
    <Window 
      title={`Web Browser - ${currentUrl}`} 
      initialW={1024} 
      initialH={700} 
      onClose={onClose} 
      onMinimize={onMinimize}
      isMinimized={isMinimized}
      zIndex={zIndex}
      // FIX: Adicionado padding nativo e removido override de classe
      padding={0}
      className="overflow-hidden flex flex-col" 
    >
      <div className="flex flex-col h-full w-full bg-[#0D0D0D]">
        
        {/* Navigation Toolbar */}
        <div className="h-10 flex items-center gap-2 px-3 bg-[#1A1A1A] border-b border-white/5">
          <div className="flex items-center gap-1 mr-2">
            <button 
              onClick={goBack}
              title="Back (Internal)"
              className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-[#FCF87C] hover:bg-white/5 rounded transition-all cursor-x11-pointer"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <button 
              onClick={reload}
              className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-[#FCF87C] hover:bg-white/5 rounded transition-all cursor-x11-pointer"
            >
              <i className={`bi bi-arrow-clockwise ${isLoading ? 'animate-spin text-[#FCF87C]' : ''}`}></i>
            </button>
          </div>

          <form onSubmit={handleNavigate} className="flex-1">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter URL..."
              className="w-full h-7 bg-black/40 border border-white/10 rounded px-3 text-[11px] text-white/80 focus:border-[#FCF87C]/40 focus:outline-none transition-all font-ubuntu"
            />
          </form>
        </div>

        {/* Viewport Area */}
        <div className="flex-1 relative bg-white">
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            title="Browser Viewport"
          />
        </div>
      </div>
    </Window>
  );
};

export default BrowserWeb;