import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Biathlon Ops | UTRA 2026",
    description: "Mission Control for UTRA Hacks Robot",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased bg-black text-white selection:bg-neonBlue selection:text-black">
                {children}
            </body>
        </html>
    );
}
