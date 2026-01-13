import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast"; // টোস্ট এলার্ট দেখানোর জন্য

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BookWorm",
  description: "A Personalized Book Recommendation & Reading Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
