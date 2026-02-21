import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME , APP_DESCRIPTION, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";



const inter = Inter({subsets : ["latin"]});
export const metadata: Metadata = {
  title: {
    /* %s means title placeholder like HOME | riza ecommerce */
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
    },
  description: `${APP_DESCRIPTION}`,
  metadataBase: new URL(SERVER_URL)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*next themes uses window object but server doesnot have window object */
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
         attribute="class"
         defaultTheme="light"
         enableSystem
         disableTransitionOnChange
        >
         {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
