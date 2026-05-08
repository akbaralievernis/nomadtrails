import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOMADTRAILS — Premium Kyrgyzstan Nomadic Tours",
  description: "Discover Kyrgyzstan's majestic mountains and authentic nomadic culture.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
