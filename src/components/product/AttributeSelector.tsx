// src/components/product/AttributeSelector.tsx
import { FormattedAttributeGroup } from "@/types";

interface AttributeSelectorProps {
  groups: FormattedAttributeGroup[];
  selectedAttributes: Record<number, number>;
  onSelect: (groupId: number, valueId: number) => void;
}

export function AttributeSelector({
  groups,
  selectedAttributes,
  onSelect,
}: AttributeSelectorProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.id}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {group.name}
            {selectedAttributes[group.id] && (
              <span className="ml-2 text-gray-500">
                - {group.values.find((v) => v.id === selectedAttributes[group.id])?.name}
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => (
              <AttributeButton
                key={value.id}
                value={value}
                isSelected={selectedAttributes[group.id] === value.id}
                onClick={() => onSelect(group.id, value.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface AttributeButtonProps {
  value: { id: number; name: string; color?: string | null };
  isSelected: boolean;
  onClick: () => void;
}

function AttributeButton({ value, isSelected, onClick }: AttributeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg border-2 transition-all cursor-pointer
        ${
          isSelected
            ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
            : "border-gray-300 hover:border-gray-400 text-gray-700"
        }
      `}
    >
      {value.color && (
        <span
          className="inline-block w-4 h-4 rounded-full mr-2 border border-gray-300"
          style={{ backgroundColor: value.color }}
        />
      )}
      {value.name}
    </button>
  );
}