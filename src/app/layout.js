import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteDataProvider } from "@/lib/siteDataContext";
import initialSiteData from "@/data/site-data.json";
import "./globals.css";

export const metadata = {
  title: initialSiteData.content?.common?.websiteTitle || "Aurelia Brass Co. | Handcrafted Luxury Brass",
  description: initialSiteData.content?.common?.footerText || "Handcrafted luxury brass hardware, custom spun lighting fixtures, sculptural home decor, and bespoke brass metalworking by Aurelia Brass Co.",
  keywords: ["Brass Shop", "Luxury Brass Hardware", "Architectural Brass Handles", "Spun Brass Pendant Lighting", "Custom Brass Fabrication", "Handcrafted Brass Decor"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('aurelia-theme');
                  var theme = saved ? saved : 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fdfbf7] dark:bg-[#0b0d12] text-slate-900 dark:text-[#f8f6f0] antialiased transition-colors duration-300 selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
        <SiteDataProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </SiteDataProvider>
      </body>
    </html>
  );
}
