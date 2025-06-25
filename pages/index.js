import Login from "../components/Login";
import AIAgentDashboard from "../src/AIAgentDashboard";

export default function Home() {
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("token");

  if (!isLoggedIn) return <Login />;
  return <AIAgentDashboard />;
}
