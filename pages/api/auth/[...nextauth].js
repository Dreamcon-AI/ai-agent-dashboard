import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// ✅ User database (use lowercase company names to match folder names)
const users = [
  { id: 1, name: "Zochert User", email: "zochert@dreamcon.com", password: "test", company: "zochert" },
  { id: 2, name: "Hargrove User", email: "hargrove@dreamcon.com", password: "test", company: "hargrove" },
  { id: 3, name: "S&S User", email: "ss@dreamcon.com", password: "test", company: "ss" },
];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Custom Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // 🔍 Look for matching user
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            company: user.company,
          };
        }

        // ❌ Login failed
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.company = user.company;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.company) {
        session.user.company = token.company;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
