import { SessionProvider } from "next-auth/react";
import '@/styles/globals.css'; // if using path aliases (check jsconfig.json or tsconfig.json)

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
