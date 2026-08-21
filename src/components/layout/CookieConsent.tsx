'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X } from 'lucide-react';

const CONSENT_KEY = 'shoppa-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage unavailable (e.g. private browsing) — skip the banner
      // rather than showing it every page load.
    }
  }, []);

  const respond = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // ignore — nothing more we can do if storage is blocked
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-rise-in border-t bg-card p-4 shadow-2xl">
      <div className="container mx-auto flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          We use cookies to keep you signed in and to understand how Shoppa is used. See our{' '}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for details.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="outline" onClick={() => respond('declined')}>
            Decline
          </Button>
          <Button size="sm" onClick={() => respond('accepted')}>
            Accept
          </Button>
          <Button size="sm" variant="ghost" className="sm:hidden" onClick={() => respond('declined')} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
