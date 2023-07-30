import Navbar from "@/components/navbar";
import "./globals.css";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Spot.",
  description: "Search your tracks!",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={openSans.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
