import { getSession } from "next-auth/react";
import AIAgentDashboard from "../../src/AIAgentDashboard";



export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.company !== "ss") {
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

export default function SSPage({ session }) {
  return <AIAgentDashboard company="ss" />;
}
