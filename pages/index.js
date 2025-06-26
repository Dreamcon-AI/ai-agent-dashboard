// pages/index.js
import { getSession } from "next-auth/react";
import AIAgentDashboard from "../src/AIAgentDashboard";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !session.user?.company) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default function Home({ session }) {
  if (!session?.user?.company) return <div>Loading...</div>;

  return <AIAgentDashboard company={session.user.company} />;
}
