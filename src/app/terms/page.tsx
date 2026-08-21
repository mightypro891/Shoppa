import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Shoppa',
  description: 'Terms and conditions for using Shoppa.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <div className="not-prose mb-8 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
        <strong>Placeholder draft.</strong> This is a starting template, not legal advice — have a
        lawyer review and customize it (especially the sections on payments, delivery liability,
        and refunds) before treating it as your actual terms.
      </div>

      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: [add date]</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By creating an account or placing an order on Shoppa, you agree to these Terms of Service.
        If you do not agree, please do not use the platform.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You're responsible for keeping your account credentials secure and for all activity under
        your account. Let us know immediately if you suspect unauthorized access.
      </p>

      <h2>3. Orders and Payment</h2>
      <p>
        Prices are shown in Nigerian Naira (₦) and may change without notice. [Describe accepted
        payment methods and when payment is captured.]
      </p>

      <h2>4. Delivery</h2>
      <p>
        [Describe delivery areas/campuses, expected delivery windows, and what happens if an item
        is unavailable or delivery is delayed.]
      </p>

      <h2>5. Returns and Refunds</h2>
      <p>
        [Describe your return window, condition requirements, and refund process — this varies a
        lot for food/perishable items vs. electronics, so it likely needs separate policies.]
      </p>

      <h2>6. Prohibited Use</h2>
      <p>
        You agree not to misuse the platform — including attempting to access other users' accounts
        or data, interfering with the site's operation, or using it for unlawful purposes.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        [This section carries real legal weight — have it drafted or reviewed by a lawyer familiar
        with Nigerian consumer protection law.]
      </p>

      <h2>8. Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of Shoppa after changes take
        effect means you accept the updated terms.
      </p>

      <h2>9. Contact</h2>
      <p>Questions about these terms? Reach us at [add support email].</p>
    </div>
  );
}
