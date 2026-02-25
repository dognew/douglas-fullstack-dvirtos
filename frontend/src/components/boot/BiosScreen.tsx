import { useEffect, useState } from 'react';

export default function BiosScreen({ onComplete }: { onComplete: () => void }) {
  const [specs, setSpecs] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/boot-specs')
      .then(res => {
        // Se a resposta não for OK (ex: 404), força a ida para o .catch
        if (!res.ok) throw new Error("Erro na API");
        return res.json();
      })
      .then(data => setSpecs(data))
      .catch(() => {
        // Agora o plano B (Fallback) sempre funcionará se a API falhar
        setSpecs({
          bios_name: 'MEGABIOS(C) 2026',
          vendor: 'DogNew Informática, MEI',
          cpu: 'Intel(R) Xeon(R) Gold 5318Y CPU @ 2.10GHz',
          speed: '2100MHz',
          ram: '28.74 GB (DDR4-3000)',
          storage: 'NVME: Samsung 980 Pro 1TB',
          motherboard: 'HUANANZHI X99-TF Gaming Motherboard'
        });
      });
  }, []);

  if (!specs) return <div className="p-10">Detecting Hardware...</div>;

  return (

    <div className="p-10 flex flex-col w-full min-h-screen select-none">
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
        <div className="col-span-12 md:col-span-6 lg:col-span-7 xl:col-span-8 2xl:col-span-9 break-words pt-2 text-center md:text-left">
          <h1 className="text-4xl tracking-tighter text-blue-800 font-bold lg:text-6xl xl:text-7xl 2xl:text-8xl">
            DOUGLAS FIEDLER
          </h1>
          <p className="text-xl text-gray-400 lg:text-2xl xl:text-3xl 2xl:text-4xl">
            DogNew Informática
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-4 uppercase text-sm text-center md:text-left">
        <p>{specs.bios_name} 2026 {specs.vendor}</p>
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
  );
}