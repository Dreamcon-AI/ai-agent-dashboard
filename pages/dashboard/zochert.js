import { getSession } from "next-auth/react";
import AIAgentDashboard from "../../src/AIAgentDashboard";



export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.company !== "zochert") {
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

export default function ZochertPage({ session }) {
  return <AIAgentDashboard company="zochert" />;
}
