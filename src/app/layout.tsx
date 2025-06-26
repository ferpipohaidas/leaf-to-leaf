import type { Metadata } from "next";
import { Raleway, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import { SessionProvider } from '@/components/SessionProvider';

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const playfair_display = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leaf to Leaf",
  description: "Tu experiencia natural premium",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${raleway.variable} ${playfair_display.variable} antialiased bg-gradient-to-b from-green-800 to-green-950 text-white min-h-screen --font-body`}>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
