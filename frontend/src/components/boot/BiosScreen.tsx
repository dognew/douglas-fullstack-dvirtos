import { useEffect } from 'react';
import BootTimer from '../shared/BootTimer';

export default function BiosScreen({ onComplete, onEnterSetup, onEnterBootMenu, specs }: {
  onComplete: () => void,
  onEnterSetup: () => void,
  onEnterBootMenu: () => void,
  specs: any
}) {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        if (typeof onEnterSetup === 'function') {
          onEnterSetup();
        }
      }
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onEnterBootMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [onEnterSetup, onEnterBootMenu]);

  if (!specs) return <div className="p-10">Detecting Hardware...</div>;

  const isMobileDevice = typeof window !== 'undefined' && 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none bg-scanlines opacity-[0.15] z-50 animate-crt-intermittent"></div>

      <div className="px-1 py-6 md:p-10 flex flex-col flex-grow w-full select-none relative z-0">
        <div className="grid grid-cols-12 gap-4 md:gap-8 items-center mb-4 md:mb-10">

          <div className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-4 2xl:col-span-3 flex justify-center md:justify-start">
            <pre className="text-lime-300 font-bold whitespace-pre overflow-visible text-[3px] leading-[3px] sm:text-[6px] sm:leading-[6px] md:text-[7px] md:leading-[7px]">
              {`                                          ##                                    
                                ##########  ####                                  
                                    ##  ##    ####                                
                                      ##  ######  ##                              
                ####                ####  ----  ##    ##          ####            
            ####    ##@@            ##          ##  ##        ####    ####        
            ##        ############  ##            ############++        ##        
            ##          ####                      ####    ####          ##        
          ####          ##                                  ##..        ####      
          ##          ####                                  ####          ##      
          ##        ####                                      ####        ##      
          ##        ####                                      ####        ##      
        ####      ####                                          ####      ####    
        ####    ####mm                                          ######    ####    
        ##      ####                                              ####      ##    
        ##    ######                                              ######    ##    
      ####    ######                                              ######    ####  
      ####      ####                                              ####      ####  
      ####      ####                                              ####      ####  
      ##        ################                      ################        ##  
    ####    ########          ############################          ######    ####
    ####    ######                    ##########++                  ######    ####
    ####      ####    ##              ##########              ##    ####      ####
    ####        ##      ####          ####    ##          MM##      ####      ####
      ####      ##      ########      ####    ####      ######      ##      ####  
        ##      ####      ######      ##      ####    ########      ##      ##    
          ##      ##                ####        ####              ####    ##      
            ##############      ######            ######      ######  ####        
              ######  ############                  ############    ####          
                  ########                                  ########              
                    ######                                  ######                
                    ######                                  ######                
                      ####                                ::####                  
                      ######                              ######                  
                        ####            ######            ####                    
                        ####        ##############        ####                    
                        ######      ##############      ######                    
                          ######      ##########      ######                      
                              ######      ##      ######                          
                                  ######      ######                              
                                      ##########                                  
                                          ##                                      `}
            </pre>
          </div>

          <div className="relative group col-span-12 md:col-span-6 lg:col-span-7 xl:col-span-8 2xl:col-span-9">
            <div className="absolute inset-0 pointer-events-none bg-scanlines mix-blend-multiply opacity-60 z-10 animate-crt-flicker"></div>

            <div className="break-words pt-0 md:pt-2 text-center md:text-left relative z-0">
              <h1 className="text-2xl sm:text-4xl tracking-tighter text-blue-800 font-eightbit font-bold lg:text-6xl xl:text-7xl 2xl:text-8xl">
                DOUGLAS FIEDLER
              </h1>
              <p className="font-eightbit text-lg sm:text-xl text-gray-400 lg:text-2xl xl:text-3xl 2xl:text-4xl tracking-tight">
                DogNew Informática
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 md:mt-10 space-y-1 md:space-y-4 uppercase text-[10px] sm:text-sm text-center md:text-left whitespace-nowrap scale-90 md:scale-100">
          <p className="text-xs sm:text-sm">{specs.bios_name} {specs.vendor}</p>
          <p className="pt-0 md:pt-2">{specs.motherboard}</p>
          <p>CPU: {specs.cpu}<br />Speed: {specs.speed}</p>
          <p>Total Memory: {specs.ram}</p>
          <div className="pt-2 md:pt-4">
            <p>Detected Devices...</p>
            <p className="pl-0 md:pl-4 opacity-80">{specs.storage}</p>
          </div>
        </div>

        <div className="mt-16 md:mt-0 md:absolute md:bottom-10 left-0 w-full flex flex-col items-center gap-8 md:gap-4 px-4 pb-12 md:pb-0">
          <div className="text-gray-500 animate-pulse text-center text-[11px] sm:text-base tracking-wide uppercase">
            {isMobileDevice 
              ? "ACESSE PELO PC PARA TER ACESSO A BIOS" 
              : "Press DEL to run setup | Press F12 for Boot Menu"}
          </div>

          {/* forced uppercase and scale for mobile fit */}
          <div className="scale-75 md:scale-100 font-mono text-white/60 uppercase tracking-widest whitespace-nowrap">
            <BootTimer
              seconds={10}
              onComplete={onComplete}
              animationClass="animate-pulse"
              message="AUTO-BOOT IN"
            />
          </div>
        </div>
      </div>
    </div>
  );
}