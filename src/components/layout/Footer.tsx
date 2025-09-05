
import { Soup } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Soup className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">Naija Shoppa</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Naija Shoppa. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
