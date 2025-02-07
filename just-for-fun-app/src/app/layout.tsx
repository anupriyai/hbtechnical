import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
});

export const metadata: Metadata = {
  title: "my k-drama hub",
  description: "anupriya's kdrama list + recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inconsolata.variable}>
      <body className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#162f6e] via-[#1b2b54] to-[#08132e] bg-[length:1000%_1000%] animate-gradient-shift"></div>
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[30rem] h-[30rem] bg-blue-500 rounded-full mix-blend-overlay filter blur-[120px] animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-[35rem] h-[35rem] bg-red-500 rounded-full mix-blend-overlay filter blur-[150px] animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-orange-400 rounded-full mix-blend-overlay filter blur-[80px] animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-overlay filter blur-[90px] animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10">
          <Navbar />
          <main className="container mx-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
