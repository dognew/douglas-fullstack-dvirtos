import { Window } from '../../system/window/Window';
import { useSession } from '../../context/SessionContext';

/**
 * Layer 5: Desktop Settings App
 * Responsibility: Fetch random wallpapers and update system state.
 */
export const DesktopSettings = ({ onClose, zIndex }: { onClose: () => void, zIndex: number }) => {
  const { setWallpaper } = useSession();
  
  /* Generating 10 random IDs for Picsum */
  const randomWallpapers = Array.from({ length: 10 }, (_, i) => 
    `https://picsum.photos/seed/${100 + i}/1920/1080`
  );

  return (
    <Window 
      title="Desktop Settings" 
      initialW={500} 
      initialH={400} 
      onClose={onClose} 
      zIndex={zIndex}
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-[#FCF87C] uppercase text-[10px] font-bold tracking-widest border-b border-white/10 pb-2">
          Select Wallpaper
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setWallpaper('default')}
            className="h-20 border border-[#FCF87C]/30 bg-black flex items-center justify-center hover:bg-[#FCF87C]/10 transition-all group"
          >
            <span className="text-[9px] text-[#FCF87C] group-hover:scale-110 transition-transform">DEFAULT THEME</span>
          </button>

          {randomWallpapers.map((url, idx) => (
            <button 
              key={idx}
              onClick={() => setWallpaper(url)}
              className="h-20 border border-white/10 overflow-hidden hover:border-[#FCF87C]/50 transition-all"
            >
              <img src={url} alt={`Wallpaper ${idx}`} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </Window>
  );
};

export default DesktopSettings;