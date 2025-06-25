// pages/index.js
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {!session ? (
        <>
          <h1 className="text-2xl mb-4">Welcome to AI Agent Dashboard</h1>
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => signIn("github")}
          >
            Sign in with GitHub
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl mb-4">Hello, {session.user.name}</h1>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </>
      )}
    </main>
  );
}
