"use client";

import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import Navbar from './components/navbar'; // Adjust the path as necessary
import Footer from './components/Footer/page'; // Adjust the path as necessary
import './globals.css'; // Adjust the path as needed

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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define pages to exclude Navbar and Footer
  const excludedPaths = ['/login', '/register', '/forgot', '/admin', '/reset',"/profilePage",'/doctorpage'];

  const isExcluded = excludedPaths.includes(pathname);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {!isExcluded && <Navbar />}  {/* Only show Navbar if not excluded */}
      <main className="container mx-auto p-4">{children}</main>
      {!isExcluded && <Footer />}  {/* Only show Footer if not excluded */}
    </div>
  );
}
