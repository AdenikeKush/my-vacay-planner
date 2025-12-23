export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <label className="block text-left text-white/90 font-medium mb-2">
        Where are you going?
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., Doha, Tokyo, Cairo"
          className="w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:ring-4 focus:ring-white/30"
        />

        <button
          type="button"
          onClick={onSearch}
          className="rounded-xl bg-white text-indigo-700 font-semibold px-6 py-3 hover:opacity-90 active:scale-[0.99]"
        >
          Search
        </button>
      </div>
    </div>
  );
}
