import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Warna Perlawanan – Brave Pink × Hero Green",
  description:
    "Ubah fotomu menjadi simbol keberanian dengan filter duotone Brave Pink × Hero Green. Upload foto dan bagikan untuk mendukung gerakan.",
  keywords: [
    "duotone filter",
    "Brave Pink",
    "Hero Green",
    "Warna Perlawanan",
    "photo campaign",
    "upload foto filter",
  ],
  authors: [{ name: "Warna Perlawanan Campaign" }],
  openGraph: {
    title: "Warna Perlawanan – Brave Pink × Hero Green",
    description: "Ubah fotomu jadi simbol keberanian dan harapan.",
    url: "https://warna-perlawanan.vercel.app/",
    siteName: "Warna Perlawanan",
    images: [
      {
        url: "https://warna-perlawanan.vercel.app/wp.png",
        width: 1200,
        height: 630,
        alt: "Preview Filter Warna Perlawanan",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warna Perlawanan – Brave Pink × Hero Green",
    description:
      "Ubah fotomu jadi simbol keberanian dengan filter Brave Pink × Hero Green.",
    images: ["https://warna-perlawanan.vercel.app/wp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${playfair.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
