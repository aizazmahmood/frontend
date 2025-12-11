import { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [email, setEmail] = useState("admin@orga.com");
  const [password, setPassword] = useState("Password1!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      const redirectTo = state?.from?.pathname || "/events";
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 space-y-4">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            EventBoard Pro
          </h1>
          <p className="text-xs text-slate-500">
            Sign in with a seeded test user.
          </p>
        </div>

        {error && (
          <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-sm font-medium rounded-lg bg-slate-900 text-white disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-[10px] text-slate-500">
          <p>Sample users:</p>
          <ul className="list-disc list-inside">
            <li>admin@orga.com</li>
            <li>mod@orga.com</li>
            <li>user1@orga.com</li>
          </ul>
          <p>
            Password: <span className="font-mono">Password1!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
