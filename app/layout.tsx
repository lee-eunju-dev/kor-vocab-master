import type { Metadata } from "next";
import { Geist_Mono, Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "어휘 냥냥",
  description: "퀴즈 풀고 냥이 모으는 국어 어휘 앱",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={cn(
        "h-full antialiased",
        inter.variable,
        notoSansKr.variable,
        geistMono.variable
      )}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
