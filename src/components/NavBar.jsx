import { Link, NavLink, useNavigate } from "react-router-dom";
import { getSession, isAuthenticated, logout } from "../utils/auth";

export default function NavBar() {
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const session = getSession();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  const base = "px-4 py-2 rounded-xl font-semibold transition";
  const inactive = "text-white/90 hover:bg-white/10";
  const active = "bg-white text-indigo-700";

  return (
    <header className="mx-auto w-full max-w-6xl px-6 py-5">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-lg font-extrabold tracking-wide">
          My Vacay Planner
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/itinerary"
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            Itinerary
          </NavLink>

          <NavLink
            to="/saved"
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            Saved Trips
          </NavLink>

          {!authed ? (
            <>
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `${base} ${isActive ? active : "bg-white text-indigo-700 hover:bg-white/90"}`
                }
              >
                Sign in
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${base} ${isActive ? active : "border border-white/30 text-white hover:bg-white/10"}`
                }
              >
                Sign up
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-white/80">
                {session?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/30 px-4 py-2 font-semibold text-white hover:bg-white/10"
                title={session?.email || "Signed in"}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
