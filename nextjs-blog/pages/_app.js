import "../styles/globals.scss";
import "../styles/globals.css";
import "../styles/icomoonStyle.css";

import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme = "light">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
