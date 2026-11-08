import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SAMP RP Translator — Anti-Kaku Roleplay English',
  description: 'AI-Powered English Translator specifically engineered for GTA San Andreas Multiplayer (SAMP) and GTA RP. Native street slang, biker culture, and /me /do action support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#070a12] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
