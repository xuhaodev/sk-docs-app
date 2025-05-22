import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSortedDocsData } from '@/lib/docs';
import ResizableSidebar from '@/components/ResizableSidebar';
import ChatBubble from '@/components/ChatBubble';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SK Docs",
  description: "Semantic Kernel Documentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allDocsData = getSortedDocsData();

  return (
    <html lang="en" className={`h-full ${inter.className}`}>
      <body className="flex min-h-full bg-[var(--background)]">
        <ResizableSidebar docs={allDocsData} />
        <main className="flex-1 p-8"
              style={{ marginLeft: 'clamp(200px, var(--sidebar-width, 256px), 600px)' }}>
          <div className="mx-auto max-w-4xl">
            {children}
          </div>
        </main>
        <ChatBubble chatbotUrl="https://haxunlweb.azurewebsites.net/" />
      </body>
    </html>
  );
}
