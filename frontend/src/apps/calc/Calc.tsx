import { useState } from 'react';
import { Window } from '../../system/window/Window';

/**
 * App: Calc (v1.1.3)
 * Responsibility: Mathematical operations using native Window layout engine.
 * Refined: Removed redundant containers after Window v2.5 layout update.
 */
const Calc = ({ 
  onClose, 
  onMinimize, 
  isMinimized, 
  zIndex 
}: { 
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  zIndex: number;
}) => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');

  const inputDigit = (digit: string) => {
    setDisplay(display === '0' ? digit : display + digit);
  };

  const inputOperator = (op: string) => {
    setFormula(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const clear = () => {
    setDisplay('0');
    setFormula('');
  };

  const calculate = () => {
    try {
      const result = new Function(`return ${formula}${display}`)();
      setDisplay(String(Number(result.toFixed(8))));
      setFormula('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const buttons = [
    { label: 'C', action: clear, color: 'text-red-400 bg-red-400/5 hover:bg-red-400/10' },
    { label: '÷', action: () => inputOperator('/') },
    { label: '×', action: () => inputOperator('*') },
    { label: 'DEL', action: () => setDisplay(display.length > 1 ? display.slice(0, -1) : '0'), color: 'text-orange-400' },
    { label: '7', action: () => inputDigit('7') },
    { label: '8', action: () => inputDigit('8') },
    { label: '9', action: () => inputDigit('9') },
    { label: '-', action: () => inputOperator('-') },
    { label: '4', action: () => inputDigit('4') },
    { label: '5', action: () => inputDigit('5') },
    { label: '6', action: () => inputDigit('6') },
    { label: '+', action: () => inputOperator('+') },
    { label: '1', action: () => inputDigit('1') },
    { label: '2', action: () => inputDigit('2') },
    { label: '3', action: () => inputDigit('3') },
    { label: '=', action: calculate, color: 'bg-[#FCF87C]/20 text-[#FCF87C] border-[#FCF87C]/30 hover:bg-[#FCF87C]/30', span: 'row-span-2' },
    { label: '0', action: () => inputDigit('0'), span: 'col-span-2' },
    { label: '.', action: () => !display.includes('.') && setDisplay(display + '.') }
  ];

  return (
    <Window 
      title="Calculadora" 
      initialW={280} 
      initialH={440} 
      onClose={onClose} 
      onMinimize={onMinimize}
      isMinimized={isMinimized}
      zIndex={zIndex}
      padding={3}
      layout="flex"
      direction="flex-col"
      config={{
        canMaximize: false,
        canResize: false,
        hasTitleBar: true,
        isClosable: true
      }}
    >
        {/* Display Area - Directly as a child of Window flex container */}
        <div className="bg-black/60 border border-white/5 p-4 rounded-lg text-right flex flex-col justify-center min-h-[80px] select-none shadow-inner w-full">
          <div className="text-[10px] text-[#FCF87C]/40 font-mono h-4 uppercase tracking-tighter">
            {formula || 'Ready'}
          </div>
          <div className="text-3xl text-[#FCF87C] font-light truncate tracking-tighter leading-tight">
            {display}
          </div>
        </div>

        {/* Buttons Grid - Now it can breathe as a flex child with flex-1 */}
        <div className="grid grid-cols-4 grid-rows-5 gap-2 flex-1 w-full min-h-0 select-none">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className={`flex items-center justify-center rounded-md border border-white/5 
                hover:bg-white/10 active:scale-95 transition-all text-sm font-medium
                ${btn.span || ''} ${btn.color || 'text-white/80 bg-white/5'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
    </Window>
  );
};

export default Calc;