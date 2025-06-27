import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Auto-redirect when logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user?.company) {
      router.replace(`/dashboard/${session.user.company}`);
    }
  }, [status, session, router]);

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result.ok) {
    // ✅ Wait for session to hydrate
    const interval = setInterval(async () => {
      const fresh = await fetch("/api/auth/session");
      const json = await fresh.json();
      if (json?.user?.company) {
        clearInterval(interval);
        router.replace(`/dashboard/${json.user.company}`);
      }
    }, 100);
  } else {
    setLoading(false);
    alert("Login failed. Check your credentials.");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 via-gray-500 to-gray-300">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          DreamCon Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
