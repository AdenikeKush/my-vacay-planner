import { NavLink } from "react-router-dom";

export default function NavBar() {
  const base =
    "rounded-xl px-4 py-2 text-sm font-semibold transition hover:bg-white/10";
  const active = "bg-white text-indigo-700 hover:bg-white/90";

  return (
    <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
      <div className="text-lg font-extrabold tracking-tight">
        My Vacay Planner
      </div>

      <div className="flex items-center gap-3">
        <NavLink
          to="/"
          className={({ isActive }) => `${base} ${isActive ? active : ""}`}
          end
        >
          Home
        </NavLink>

        <NavLink
          to="/itinerary"
          className={({ isActive }) => `${base} ${isActive ? active : ""}`}
        >
          Itinerary
        </NavLink>

        <NavLink
          to="/saved"
          className={({ isActive }) => `${base} ${isActive ? active : ""}`}
        >
          Saved Trips
        </NavLink>
      </div>
    </nav>
  );
}
