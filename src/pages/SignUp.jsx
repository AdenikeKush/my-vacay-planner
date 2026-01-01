import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signUp, isAuthenticated } from "../utils/auth";
import { seedDemoTripOnce } from "../utils/storage";

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("redirect") || "/saved";
  }, [location.search]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (isAuthenticated()) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (!name.trim()) return setErr("Please enter your name.");
    if (!email.trim() || !email.includes("@")) return setErr("Please enter a valid email.");
    if (!password || password.length < 6) return setErr("Password must be at least 6 characters.");

    try {
      signUp({ name, email, password });

      // ✅ Seed a demo trip ONLY if this user has no trips yet
      seedDemoTripOnce();

      navigate(redirectTo, { replace: true });
    } catch (e2) {
      setErr(e2.message || "Sign up failed.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-lg backdrop-blur">
        <p className="text-sm font-semibold tracking-widest text-white/80">TRAVELMATE</p>
        <h1 className="mt-2 text-3xl font-extrabold">Create an account</h1>
        <p className="mt-2 text-white/80">
          Demo authentication for presentation (stored locally in your browser).
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

          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            Sign up
          </button>

          <div className="text-sm text-white/70">
            Already have an account?{" "}
            <Link
              to={`/signin?redirect=${encodeURIComponent(redirectTo)}`}
              className="font-semibold text-white underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>

          <div className="text-sm text-white/70">
            <Link to="/" className="font-semibold text-white underline underline-offset-4">
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
