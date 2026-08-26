import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Thartos · D&D Charakterbogen',description:'Interaktiver Charakterbogen für Thartos, Mensch und Paladin der 3. Stufe.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="de"><body>{children}</body></html>}
