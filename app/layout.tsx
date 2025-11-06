import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
    title: "Ticket Board",
    description: "Personal ticket management for indie developers",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="de" suppressHydrationWarning>
            <body className="antialiased">
                <div className="min-h-screen bg-gray-50">
                    <AuthProvider>{children}</AuthProvider>
                </div>
            </body>
        </html>
    );
}
