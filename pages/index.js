import { useSession } from "next-auth/react";
import Login from "../components/Login";
import AIAgentDashboard from "../src/AIAgentDashboard";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="text-center p-8">Loading...</div>;
  if (!session) return <Login />;

  return <AIAgentDashboard />;
}
