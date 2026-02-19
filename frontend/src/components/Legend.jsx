export default function Legend({ colors, filterLevel, reset }) {
  return (
    <div className="flex items-center gap-6 mb-6 text-sm shrink-0">
      <span className="text-gray-500 font-medium">
        Activity Level:
      </span>

      <div className="flex items-center gap-2">
        {colors.map((c, i) => (
          <div
            key={i}
            onClick={() => filterLevel(i)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 group"
          >
            <div
              className={`w-4 h-4 ${c.bg} border border-white/10 group-hover:scale-110`}
            />
            <span className="text-[11px] text-gray-400 font-bold uppercase">
              {c.label}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={reset}
        className="ml-4 text-xs text-green-500 hover:text-green-400 font-semibold uppercase"
      >
        Reset View
      </button>
    </div>
  );
}
