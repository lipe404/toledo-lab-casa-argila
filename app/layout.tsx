import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Casa Argila | Projeto conceitual',
  description: 'Uma loja conceitual de cerâmica artesanal.',
  robots: { index: false, follow: true }
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
