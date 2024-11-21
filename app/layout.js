import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import Footer from "@/components/Footer";
import NavRenderer from "@/components/NavRenderer";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "NDC CAPACITY SCORECARD - AGNES",
  description: "Nationally Determined Contributions (NDCs) Scorecard",
  icons: {
    icon: '/favicon.ico', // Assuming your favicon.ico is in the public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        <NavRenderer />
        <section className="pt-12">
          {children}
        </section>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
