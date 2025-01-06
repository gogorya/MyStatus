import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-inter",
  fallback: ["system-ui"],
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} antialiased min-h-screen h-full`}
      >
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          ></meta>
        </head>
        <body className="min-h-full h-full w-full snap-y bg-gray-100 dark:bg-black">
          <ThemeProvider attribute="class">
            <div className="">
              <div className="flex flex-col max-w-4xl mx-auto">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
