
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import CelebrationPopup from '@/components/layout/CelebrationPopup';
import CookieConsent from '@/components/layout/CookieConsent';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WishlistProvider } from '@/context/WishlistContext';
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://shoppa.vercel.app'),
  title: {
    default: 'Shoppa',
    template: '%s | Shoppa',
  },
  description: 'Your one-stop shop for Nigerian foodstuffs, designed for students.',
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} h-full`} suppressHydrationWarning>
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
            <TooltipProvider>
                {children}
                <CelebrationPopup />
                <CookieConsent />
                <Toaster />
            </TooltipProvider>
            </WishlistProvider>
            </CartProvider>
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
