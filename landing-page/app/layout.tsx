import Script from "next/script";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* add title */}
      <head>
        <title>Heimdall</title>
      </head>
      <body className="antialiased dark">{children}</body>

      <Script src="https://script.supademo.com/supademo.js"></Script>
    </html>
  );
}
