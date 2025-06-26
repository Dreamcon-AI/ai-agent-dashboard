// pages/_app.js
import "../src/index.css"; // ← make sure this is the right file
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
