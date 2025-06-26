import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        // Simple hardcoded auth (replace with DB logic later)
        if (username === "admin" && password === "password123") {
          return { id: 1, name: "Admin User", email: "admin@example.com" };
        }

        // If login fails
        return null;
      }
    })
  ],
  pages: {
    signIn: "/", // Redirect to homepage login form
    error: "/",  // Redirect back on failure
  },
  secret: process.env.NEXTAUTH_SECRET
});
