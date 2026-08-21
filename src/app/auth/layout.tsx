
import Link from 'next/link';
import StoreLogo from '@/components/layout/StoreLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="dark relative flex min-h-screen flex-col overflow-hidden bg-[#0a0a0a] text-white"
      style={{
        // Scoped overrides so shadcn components (Card, Input, Button, Form)
        // render true near-black instead of the site's warm dark theme.
        // Primary/accent still inherit from the .dark class below (brand orange).
        // @ts-ignore custom properties
        '--background': '0 0% 4%',
        '--foreground': '0 0% 98%',
        '--card': '0 0% 9%',
        '--card-foreground': '0 0% 98%',
        '--border': '0 0% 18%',
        '--input': '0 0% 18%',
        '--muted': '0 0% 14%',
        '--muted-foreground': '0 0% 62%',
        '--secondary': '0 0% 12%',
        '--secondary-foreground': '0 0% 98%',
        '--ring': '16 100% 66%',
      } as React.CSSProperties}
    >
      {/* Grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[100px] animate-float"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-1/4 h-[26rem] w-[26rem] rounded-full bg-orange-700/20 blur-[100px] animate-float [animation-delay:2s]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[20rem] w-[36rem] rounded-full bg-primary/10 blur-[120px]"
      />

      <header className="relative z-10 flex items-center justify-center py-8">
        <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
          <StoreLogo className="h-8 w-8 text-primary" />
          <span className="font-headline text-lg font-bold tracking-tight">Shoppa</span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        {children}
      </main>
    </div>
  )
}
