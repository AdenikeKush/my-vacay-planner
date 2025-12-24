import { NavLink } from "react-router-dom";

const linkBase =
  "px-4 py-2 rounded-xl font-semibold transition text-sm sm:text-base";
const active = "bg-white text-indigo-700";
const inactive = "text-white/90 hover:text-white hover:bg-white/10";

export default function NavBar() {
  return (
    <nav className="w-full border-b border-white/10 bg-white/5 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink to="/" className="font-extrabold text-white text-lg">
          My Vacay Planner
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : inactive}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/itinerary"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : inactive}`
            }
          >
            Itinerary
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
