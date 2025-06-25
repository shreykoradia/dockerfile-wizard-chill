
import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export const useKonamiCode = () => {
  const [keys, setKeys] = useState<string[]>([]);
  const [konamiActivated, setKonamiActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys(prevKeys => {
        const newKeys = [...prevKeys, event.code];
        const lastTenKeys = newKeys.slice(-10);
        
        if (JSON.stringify(lastTenKeys) === JSON.stringify(KONAMI_CODE)) {
          setKonamiActivated(true);
          return [];
        }
        
        return lastTenKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { konamiActivated, resetKonami: () => setKonamiActivated(false) };
};
