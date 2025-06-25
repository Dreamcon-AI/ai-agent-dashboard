import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // 🔐 Replace this with your real auth logic
        const { username, password } = credentials;

        // Example: hardcoded login (replace with DB or API check)
        if (username === "admin" && password === "test123") {
          return { id: 1, name: "Admin User", email: "admin@example.com" };
        }

        // ❌ Invalid login
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/", // use your home page as login
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
