'use client';

import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): { score: number; label: string } {
  if (!password) return { score: 0, label: '' };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const clamped = Math.min(score, labels.length - 1);
  return { score: clamped, label: labels[clamped] };
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label } = getStrength(password);
  if (!password) return null;

  const colors = ['bg-destructive', 'bg-destructive', 'bg-amber-500', 'bg-amber-500', 'bg-green-600'];

  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              i <= score ? colors[score] : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
