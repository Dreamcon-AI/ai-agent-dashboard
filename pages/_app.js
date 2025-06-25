// pages/_app.js
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css"; // adjust path if needed

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
