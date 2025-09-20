
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import CelebrationPopup from '@/components/layout/CelebrationPopup';
import { WishlistProvider } from '@/context/WishlistContext';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: {
    default: 'Shoppa',
    template: '%s | Shoppa',
  },
  description: 'Your one-stop shop for Nigerian foodstuffs, designed for students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.className} h-full`} suppressHydrationWarning>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
            <CartProvider>
            <WishlistProvider>
                {children}
                <CelebrationPopup />
                <Toaster />
            </WishlistProvider>
            </CartProvider>
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
