import { useState, useEffect } from 'react';

export function useHardware() {
  const [specs, setSpecs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    fetch(`${apiUrl}/boot-specs`)
      .then(res => res.json())
      .then(data => {
        setSpecs(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback Plan B
        setSpecs({
          bios_name: 'MEGABIOS(FALLBACK) 2026',
          vendor: 'DogNew Informática, MEI [F]',
          cpu: 'Intel(R) Xeon(R) Gold 5318Y CPU [F] @ 2.10GHz',
          speed: '2100MHz (FAKE)',
          ram: '28.74 GB (DDR4-3000 VIRTUAL)',
          storage: 'NVME: Samsung 980 Pro 1TB [F]',
          motherboard: 'HUANANZHI X99-TF Gaming Motherboard'
        });
        setLoading(false);
      });
  }, []);

  return { specs, loading };
}