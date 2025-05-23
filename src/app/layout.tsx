import type { Metadata } from "next";
//import localFont from "next/font/local";
import "./globals.css";
import Container from "../components/global/Container";
import Providers from "./Providers";
import Navbar from "../components/navbar/Navbar";
import { ClerkProvider } from '@clerk/nextjs';




// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: 'Next Store',
  description: 'A nifty store built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
      <Providers>
      <Navbar />
      <Container className='py-20'>{children}</Container>
      </Providers>
    </body>
    </html>
    </ClerkProvider>
  );
}
