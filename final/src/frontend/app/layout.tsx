import Providers from "@/context/Providers";
import Footer from "./Footer";
import "./globals.css";
import Header from "./Header";

export const metadata = {
  title: "ASC",
  description: "ASC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <Providers>
          <div className="bg-[#f8f3ee] border-b border-gray-400 shadow-b shadow-md">
            <Header />
          </div>
          <div className="fit">{children}</div>
          <div className="bg-[#f8f3ee] border-t border-gray-400 shadow-t shadow-md">
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
