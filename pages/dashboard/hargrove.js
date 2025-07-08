import { getSession } from "next-auth/react";

export default function HargroveDashboard({ session }) {
  return (
    <div>
      <h1>Hargrove Dashboard</h1>
      <p>Welcome, {session?.user?.email}</p>
      <p>Company: {session?.user?.company}</p>
      <p>Role: {session?.user?.role}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // ⛔ Not logged in
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // ⛔ Wrong company
  if (session.user?.company !== "hargrove") {
    return {
      redirect: {
        destination: "/unauthorized", // Optional: create this page
        permanent: false,
      },
    };
  }

  // ✅ Good to go
  return {
    props: {
      session,
    },
  };
}
