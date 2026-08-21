
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Reveal from '@/components/ui/reveal';


const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type SignInFormValues = z.infer<typeof formSchema>;


const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8C0 120.3 106.5 8 244 8s244 112.3 244 253.8zM138.3 327.4c-21.6-32-34.1-70-34.1-111.4s12.5-79.4 34.1-111.4h1.2c19.4 31.8 32.3 69.6 34.6 110.2-2.3 40.6-15.2 78.4-34.6 110.2h-1.2zM244 500c66.7 0 123.6-43.5 146.1-103.1H97.9C120.4 456.5 177.3 500 244 500zM449.2 327.4c-21.6-32-34.1-70-34.1-111.4s12.5-79.4 34.1-111.4h1.2c19.4 31.8 32.3 69.6 34.6 110.2-2.3 40.6-15.2 78.4-34.6 110.2h-1.2zM244 20c66.7 0 123.6 43.5 146.1 103.1H97.9C120.4 63.5 177.3 20 244 20z"></path>
  </svg>
);


export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { googleSignIn, emailSignIn, rawIsAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);

  // After a successful email/password sign-in, whether this user is an admin
  // isn't known immediately — AuthContext resolves it in a separate effect
  // once the admins list loads. This ref holds the pending redirect decision
  // until `loading` (which includes admin-status resolution) settles.
  const pendingLogin = useRef<{ isNewUser: boolean } | null>(null);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSuccessfulLogin = (isNewUser: boolean, isAdmin: boolean) => {
    const redirectUrl = searchParams.get('redirect');

    if (redirectUrl) {
      router.push(redirectUrl);
      return;
    }

    if (isNewUser) {
      router.push('/auth/welcome');
    } else if (isAdmin) {
      router.push('/auth/select-role');
    } else {
      router.push('/');
    }
  };

  // Fires once AuthContext has resolved admin status after a sign-in.
  useEffect(() => {
    if (pendingLogin.current && !loading) {
      const { isNewUser } = pendingLogin.current;
      pendingLogin.current = null;
      handleSuccessfulLogin(isNewUser, rawIsAdmin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, rawIsAdmin]);

  // Ticks down the cooldown countdown once a lockout starts.
  useEffect(() => {
    if (!cooldownUntil) return;
    const interval = setInterval(() => {
      const secondsLeft = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (secondsLeft <= 0) {
        setCooldownUntil(null);
        setCooldownSecondsLeft(0);
        clearInterval(interval);
      } else {
        setCooldownSecondsLeft(secondsLeft);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  const onSubmit = async (data: SignInFormValues) => {
      if (cooldownUntil && cooldownUntil > Date.now()) return;

      setIsSubmitting(true);
      try {
          const loggedInUser = await emailSignIn(data.email, data.password);
          if (loggedInUser) {
            setFailedAttempts(0);
            pendingLogin.current = { isNewUser: false };
          }
      } catch (error: any) {
          // Basic client-side throttling after repeated failed attempts. This is
          // a UX-level speed bump, not real bot protection — for that, this app
          // needs Firebase App Check configured with your own reCAPTCHA keys.
          const nextAttempts = failedAttempts + 1;
          setFailedAttempts(nextAttempts);
          if (nextAttempts >= 5) {
            const lockoutMs = 30_000;
            setCooldownUntil(Date.now() + lockoutMs);
            setCooldownSecondsLeft(Math.ceil(lockoutMs / 1000));
            toast({
              title: 'Too many failed attempts',
              description: 'Please wait 30 seconds before trying again.',
              variant: 'destructive',
            });
          } else {
            toast({
                title: 'Sign In Failed',
                description: error.message,
                variant: 'destructive',
            });
          }
      } finally {
        setIsSubmitting(false);
      }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const { isNewUser } = await googleSignIn();
      pendingLogin.current = { isNewUser };
    } catch (error: any) {
       toast({
        title: 'Google Sign-In Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Reveal>
    <Card className="w-full max-w-md border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_0_60px_-15px] shadow-primary/30">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
        <CardDescription className="text-white/50">
          Sign in to your account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-white/70">Email</FormLabel>
                        <FormControl>
                            <Input placeholder="name@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/40 focus-visible:border-primary/50" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel className="text-white/70">Password</FormLabel>
                            <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative">
                            <FormControl>
                                <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/40 focus-visible:border-primary/50" {...field} />
                            </FormControl>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-white/40 hover:text-white hover:bg-white/10"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting || cooldownSecondsLeft > 0}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {cooldownSecondsLeft > 0 ? `Try again in ${cooldownSecondsLeft}s` : 'Sign In'}
                </Button>
            </form>
          </Form>

          <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-white/40">
              Or continue with
              </span>
          </div>
          </div>
          <Button className="w-full border-white/15 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white" variant="outline" onClick={handleGoogleSignIn} disabled={isSubmitting}>
            <GoogleIcon />
            Sign in with Google
          </Button>
      </CardContent>
       <CardFooter className="flex justify-center text-sm text-white/50">
            <p>Don't have an account?&nbsp;</p>
            <Link href="/auth/signup" className="text-primary hover:text-primary/80 hover:underline">
             Sign Up
            </Link>
      </CardFooter>
    </Card>
    </Reveal>
  );
}
