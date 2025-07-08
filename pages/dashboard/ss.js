import { getSession } from "next-auth/react";

export default function SSDashboard({ session }) {
  return (
    <div>
      <h1>S&S Dashboard</h1>
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
  if (session.user?.company !== "SS") {
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
