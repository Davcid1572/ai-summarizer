interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  isLoading: boolean;
}

export default function TextInput({
  value,
  onChange,
  isLoading,
}: TextInputProps) {
  const wordCount =
    value.trim() === "" ? 0 : value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">
          Paste your text
        </label>
        <span className="text-xs text-gray-500">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        placeholder="Paste any text here — articles, essays, reports, emails..."
        rows={10}
        className="w-full bg-gray-800 text-gray-100 placeholder-gray-600
                   border border-gray-700 rounded-xl px-4 py-3
                   text-sm leading-relaxed resize-none outline-none
                   focus:border-blue-500 transition-colors duration-150
                   disabled:opacity-50"
      />
    </div>
  );
}
