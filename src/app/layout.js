import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BookWorm - Track Your Reading",
  description:
    "A personalized book recommendation and reading tracker application.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
      >
        <AuthProvider>
          <NextTopLoader
            color="#2563EB"
            initialPosition={0.08}
            crawlSpeed={200}
            height={4}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          />

          <Toaster position="top-right" />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
