import { SummaryMode } from "@/types/summary";

interface ModeSelectorProps {
  selected: SummaryMode;
  onChange: (mode: SummaryMode) => void;
}

const modes: { value: SummaryMode; label: string; description: string }[] = [
  {
    value: "brief",
    label: "Brief",
    description: "2-3 sentences",
  },
  {
    value: "detailed",
    label: "Detailed",
    description: "Full summary",
  },
  {
    value: "bullets",
    label: "Bullets",
    description: "Key points list",
  },
];

export default function ModeSelector({
  selected,
  onChange,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Summary Style</label>
      <div className="flex gap-3">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            className={`flex-1 flex flex-col items-center gap-1 px-4 py-3 
                       rounded-xl border transition-all duration-150
                       ${
                         selected === mode.value
                           ? "bg-blue-600 border-blue-500 text-white"
                           : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                       }`}
          >
            <span className="text-sm font-medium">{mode.label}</span>
            <span className="text-xs opacity-70">{mode.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
