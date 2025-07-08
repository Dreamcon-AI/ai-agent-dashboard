import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      const session = await getSession();
      const { company } = session.user;
      router.push(`/${company}`);
    } else {
      alert('Login failed');
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-600 flex items-center justify-center px-4">
    <div className="bg-gray-500 shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-300">
      {/* Company Logo */}
      <div className="flex items-center justify-center mb-6">
        <img
          src="/logos/dc.png"
          alt="Dreamcon Logo"
          className="h-45 object-contain"
        />
      </div>

      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-5">
        AI Agent Dashboard
      </h1>

      <form onSubmit={handleLogin} className="space-y-5">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            'Log In'
          )}
        </button>
      </form>
    </div>
  </div>
);
}
