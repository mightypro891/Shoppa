
import Link from "next/link";
import StoreLogo from "./StoreLogo";

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <StoreLogo className="h-7 w-auto" />
            <span className="font-bold text-lg font-headline">Shoppa</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Shoppa. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
