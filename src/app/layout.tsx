import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/hooks/useAuth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
