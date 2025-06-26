import { useSession } from "next-auth/react";
import Login from '@/components/Login'; // only if this path is valid
import AIAgentDashboard from "@/AIAgentDashboard"; // ✅ THIS IS THE FIX

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <Login />;

  return <AIAgentDashboard />;
}
