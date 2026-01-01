import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login, isAuthenticated } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("redirect") || "/saved";
  }, [location.search]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    // Already logged in? Go straight through.
    if (isAuthenticated()) {
      navigate(redirectTo, { replace: true });
      return;
    }

    // Basic validation (demo auth)
    if (!name.trim()) return setErr("Please enter your name.");
    if (!email.trim() || !email.includes("@")) return setErr("Please enter a valid email.");

    login({ name, email });
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-lg backdrop-blur">
        <p className="text-sm font-semibold tracking-widest text-white/80">
          TRAVELMATE ACCESS
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">Sign in</h1>
        <p className="mt-2 text-white/80">
          This is a demo sign-in for presentation. Your trips are saved locally on this browser.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="text-sm font-semibold">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adenike"
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white/50"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adenike@email.com"
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white/50"
            />
          </div>

          {err ? (
            <div className="rounded-xl border border-red-200/40 bg-red-200/10 px-4 py-3 text-sm text-red-100">
              {err}
            </div>
          ) : null}

          <button
            type="submit"
            className="mt-1 rounded-xl bg-white px-4 py-3 font-semibold text-indigo-700 hover:bg-white/90"
          >
            Continue
          </button>

          <div className="text-sm text-white/70">
            Prefer to explore first?{" "}
            <Link to="/" className="font-semibold text-white underline underline-offset-4">
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
