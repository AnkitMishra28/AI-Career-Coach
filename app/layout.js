import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import ConditionalFooter from "@/components/conditional-footer";
import PageTransition from "@/components/page-transition";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SenseAI — The AI Career Operating System",
  description: "Measure career health, audit ATS resumes, run WebRTC mock interviews, and track applications with SenseAI.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          card: "bg-transparent border-none shadow-none p-0",
          headerTitle: "text-foreground font-bold text-lg",
          headerSubtitle: "text-muted-foreground text-xs",
          socialButtonsBlockButton: "bg-white/[0.04] border border-white/10 hover:bg-white/10 text-foreground rounded-xl",
          formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium shadow-lg shadow-indigo-600/25",
          footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className="dark">
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className} bg-[#07080B] text-foreground antialiased min-h-screen flex flex-col justify-between`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1 w-full">
              <PageTransition>{children}</PageTransition>
            </main>
            <Toaster richColors position="top-right" />
            <ConditionalFooter />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
