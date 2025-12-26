import { useEffect, useRef, useState } from "react";

export default function SearchBar({ onSearch, initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch?.(trimmed);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto mt-8 flex w-full max-w-3xl items-center gap-3"
    >
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search destinations (e.g., Tokyo, Paris, Doha)..."
        className="w-full rounded-2xl border border-white/30 bg-white/10 px-5 py-4 text-white placeholder-white/60 outline-none backdrop-blur focus:border-white/60"
      />

      <button
        type="submit"
        className="rounded-2xl bg-white px-6 py-4 font-semibold text-indigo-700 hover:bg-white/90"
      >
        Search
      </button>
    </form>
  );
}
