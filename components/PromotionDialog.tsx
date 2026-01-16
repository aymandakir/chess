"use client";

interface PromotionDialogProps {
  color: 'w' | 'b';
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
  onCancel: () => void;
}

export default function PromotionDialog({ color, onSelect, onCancel }: PromotionDialogProps) {
  const pieces = [
    { value: 'q', name: 'Queen', symbol: color === 'w' ? '♕' : '♛' },
    { value: 'r', name: 'Rook', symbol: color === 'w' ? '♖' : '♜' },
    { value: 'b', name: 'Bishop', symbol: color === 'w' ? '♗' : '♝' },
    { value: 'n', name: 'Knight', symbol: color === 'w' ? '♘' : '♞' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-2 text-center">
          Choose Promotion
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 text-center">
          Select which piece your pawn becomes
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {pieces.map((piece) => (
            <button
              key={piece.value}
              onClick={() => onSelect(piece.value)}
              className="group relative bg-neutral-50 dark:bg-neutral-700 hover:bg-primary-50 dark:hover:bg-primary-950/50 border-2 border-neutral-200 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-500 rounded-xl p-6 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="text-6xl text-center mb-2 group-hover:scale-110 transition-transform">
                {piece.symbol}
              </div>
              <div className="text-center font-semibold text-neutral-900 dark:text-white">
                {piece.name}
              </div>
            </button>
          ))}
        </div>
        
        <button
          onClick={onCancel}
          className="w-full mt-4 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
