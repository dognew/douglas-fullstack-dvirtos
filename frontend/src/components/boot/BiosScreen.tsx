import { useEffect } from 'react';

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

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-scanlines opacity-[0.15] z-50 animate-crt-intermittent"></div>

      <div className="p-10 flex flex-col w-full min-h-screen select-none relative z-0">
        <div className="grid grid-cols-12 gap-8 items-center mb-10">

          <div className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-4 2xl:col-span-3 flex justify-center md:justify-start">
            <pre className="text-lime-300 font-bold whitespace-pre overflow-visible text-[4px] leading-[4px] sm:text-[6px] sm:leading-[6px] md:text-[7px] md:leading-[7px]">
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
            
            <div className="break-words pt-2 text-center md:text-left relative z-0">
              <h1 className="text-4xl tracking-tighter text-blue-800 font-eightbit font-bold lg:text-6xl xl:text-7xl 2xl:text-8xl">
                DOUGLAS FIEDLER
              </h1>
              <p className="font-eightbit text-xl text-gray-400 lg:text-2xl xl:text-3xl 2xl:text-4xl">
                DogNew Informática
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-4 uppercase text-sm text-center md:text-left">
          <p>{specs.bios_name} {specs.vendor}</p>
          <p className="pt-2">{specs.motherboard}</p>
          <p>CPU: {specs.cpu}<br />Speed: {specs.speed}</p>
          <p>Total Memory: {specs.ram}</p>
          <div className="pt-4">
            <p>Detected Devices...</p>
            <p className="pl-4">{specs.storage}</p>
          </div>
        </div>

        <div className="mt-auto pt-10 text-gray-500 animate-pulse text-center md:text-left">
          Press DEL to run setup | Press F12 for Boot Menu
        </div>

        <div className="mt-10 flex justify-center">
          {/* Botão para simular a conclusão do processo e destruição da tela */}
          <p>&nbsp;</p>
          <button onClick={onComplete} className="mt-4 self-start text-[10px] text-gray-500 hover:text-white transition-colors">
            [ SIMULATE SYSTEM BOOT ]
          </button>
        </div>
      </div>
    </div>
  );
}