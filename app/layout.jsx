import "./globals.css";
import Shell from "@/components/Shell";
import { site } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.title}`
  },
  description: site.description,
  authors: [{ name: site.author }],
  alternates: {
    canonical: "/",
    types: {
      "application/atom+xml": "/atom.xml"
    }
  },
  icons: {
    icon: "/images/favicon.svg"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang={site.language} suppressHydrationWarning>
      <body>
        <div className="web-bg" />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}

