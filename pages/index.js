import { getSession } from "next-auth/react";

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
    redirect: {
      destination: `/dashboard/${session.user.company}`,
      permanent: false,
    },
  };
}

export default function Home() {
  return null; // never rendered, just redirects
}
