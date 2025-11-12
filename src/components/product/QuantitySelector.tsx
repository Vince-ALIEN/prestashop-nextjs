// src/components/product/QuantitySelector.tsx
interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (value: number) => void;
}

export function QuantitySelector({
  quantity,
  maxQuantity,
  onIncrement,
  onDecrement,
  onChange,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center w-full">
      <button
        onClick={onDecrement}
        className="w-18 h-12 rounded-l-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
      >
        −
      </button>
      <input
        type="number"
        min="1"
        max={maxQuantity}
        value={quantity}
        onChange={(e) => onChange(parseInt(e.target.value) || 1)}
        className="w-full h-12 text-center border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        onClick={onIncrement}
        className="w-18 h-12 rounded-r-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
      >
        +
      </button>
    </div>
  );
}