import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PWAProvider from "@/components/PWAProvider";
import DesktopToolbar from "@/components/DesktopToolbar";

export const metadata: Metadata = {
  title: "Afrikapedia — The Free African Encyclopaedia",
  description:
    "A free, open-source encyclopedia dedicated to documenting African history, culture, science, and innovation.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#c9a84c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-serif min-h-screen">
        <PWAProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            {children}
            <Footer />
          </div>
          <DesktopToolbar />
        </PWAProvider>
      </body>
    </html>
  );
}
