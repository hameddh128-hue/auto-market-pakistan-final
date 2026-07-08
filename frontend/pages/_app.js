import "../styles/globals.css";
import { Sora, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../lib/AuthContext";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function App({ Component, pageProps }) {
  return (
    <div className={`${sora.variable} ${inter.variable}`}>
      <AuthProvider>
        <Toaster position="top-center" />
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  );
}
