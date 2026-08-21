import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Shoppa',
  description: 'How Shoppa collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <div className="not-prose mb-8 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
        <strong>Placeholder draft.</strong> This reflects what the app actually does today (Firebase
        Auth, Firestore, Google AI for a few features) — update it as your data practices change,
        and have it reviewed against Nigeria's NDPR (Nigeria Data Protection Regulation) before launch.
      </div>

      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: [add date]</p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Account info: name, email, and photo (via email/password or Google sign-in)</li>
        <li>Order info: delivery address, phone number, order history</li>
        <li>Usage data: pages visited, products viewed, general device/browser info</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        To process orders and deliveries, manage your account, respond to support requests, and
        improve the platform. A few features (recipe suggestions, order-confirmation notes, and
        the support chat) use Google's Gemini AI models to generate text — your message content for
        those features is sent to Google for processing.
      </p>

      <h2>3. Cookies</h2>
      <p>
        We use cookies to keep you signed in and understand how the site is used. You can decline
        non-essential cookies via the banner shown on your first visit.
      </p>

      <h2>4. Data Sharing</h2>
      <p>
        We don't sell your personal information. We share data with service providers necessary to
        run the platform (Firebase/Google Cloud for hosting and authentication, and [your delivery
        partners / payment processor once integrated]).
      </p>

      <h2>5. Data Security</h2>
      <p>
        Your data is stored with Firebase/Google Cloud and protected by access-control rules that
        restrict who can read or modify it. No system is 100% secure, but we take reasonable steps
        to protect your information.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You can view and update most of your account information from your{' '}
        <a href="/profile">profile page</a>. To request deletion of your account or data, contact us
        at [add support email].
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>We may update this policy periodically. Material changes will be reflected here with an updated date.</p>

      <h2>8. Contact</h2>
      <p>Questions about this policy? Reach us at [add support email].</p>
    </div>
  );
}
