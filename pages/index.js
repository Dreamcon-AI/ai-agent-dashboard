import { useSession } from "next-auth/react";
import Login from '@/components/Login'; // or relative to file location
import AIAgentDashboard from "../src/AIAgentDashboard";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <Login />;

  return <AIAgentDashboard />;
}
