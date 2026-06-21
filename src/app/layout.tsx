import './globals.css';
import { Inter } from 'next/font/google';
import { AppProvider } from '../context/AppContext';
import { CalculatorWidget } from '../components/Calculator';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sewa Automobile',
  description: 'Full-stack Automobile Service Management App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <AppProvider>
          {children}
          <CalculatorWidget />
        </AppProvider>
      </body>
    </html>
  );
}
