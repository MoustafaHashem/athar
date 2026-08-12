import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أثر — برنامج إعداد القادة | عشيرة جوالة هندسة عين شمس",
  description: "المنصة التفاعلية لبرنامج إعداد القادة — القائد الحقيقي يصنع أثرًا. نادي الكشافة البحرية بالقاهرة (13-15 أغسطس).",
  icons: {
    icon: "/images/branding/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="bg-sand min-h-screen flex flex-col font-cairo text-dark">
        {children}
      </body>
    </html>
  );
}
