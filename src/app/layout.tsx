import { BackgroundProvider } from "@/contexts/BackgroundContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import "@/utils/resetBackground";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import DynamicBackground from "./DynamicBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Chatnary - Document Chat System",
  description: "Chat with your documents using AI. Upload, search, and interact with your files seamlessly.",
  keywords: ["document", "chat", "AI", "search", "upload"],
  
  // Disable caching in development
  ...(process.env.NODE_ENV === 'development' && {
    other: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.variable} font-sans antialiased theme-transition min-h-screen`}>
        <BackgroundProvider>
          <ThemeProvider defaultTheme="light">
            <ToastProvider>
              {/* Dynamic gradient backgrounds */}
              <DynamicBackground />
              
              {/* Content overlay */}
              <div className="relative min-h-screen">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  {children}
                </div>
              </div>
            </ToastProvider>
          </ThemeProvider>
        </BackgroundProvider>
      </body>
    </html>
  );
}
