// Global styles and fonts
import "./globals.css";
import { Inter } from "next/font/google";

// Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClerkThemeProvider from "@/components/ClerkThemeProvider";

// UI components
import { Toaster } from "@/components/ui/sonner";

// Providers
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  fallback: ["system-ui"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
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
          <ClerkThemeProvider>
            <div className="">
              <div className="flex flex-col max-w-4xl mx-auto">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
            <Toaster />
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
