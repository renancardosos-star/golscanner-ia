import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GolScanner IA — Renan Cardoso",
  description: "Ranking de jogos para gols com IA, múltiplas e histórico ADM.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
