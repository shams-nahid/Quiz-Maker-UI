"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ThemeProvider } from "@/context";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Provider store={store}>
          <ThemeProvider>
            <div className='min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors'>
              {children}
            </div>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
