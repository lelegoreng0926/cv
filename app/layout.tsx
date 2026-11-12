import type { Metadata } from "next";
import "./globals.css";
import "lenis/dist/lenis.css";
import "./dimas/cv/lenis.css";
import CustomCursor from "./dimas/components/CustomCursor";
import CursorSpotlight from "./dimas/components/CursorSpotlight";
import { LanguageProvider } from "./dimas/i18n/LanguageProvider";
import { SmoothScrollProvider } from "./dimas/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Dimas Iman Ismail — CV Digital",
  description:
    "Portfolio dan CV digital Dimas Iman Ismail, siswa RPL SMK Telkom Makassar. Web, mobile, dan UI/UX.",
  openGraph: {
    title: "Dimas Iman Ismail — CV Digital",
    description:
      "Portfolio dan CV digital Dimas Iman Ismail, siswa RPL SMK Telkom Makassar. Web, mobile, dan UI/UX.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <LanguageProvider>
          <SmoothScrollProvider>
            <CursorSpotlight />
            <CustomCursor />
            {children}
          </SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
