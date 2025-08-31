
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8C0 120.3 106.5 8 244 8s244 112.3 244 253.8zM138.3 327.4c-21.6-32-34.1-70-34.1-111.4s12.5-79.4 34.1-111.4h1.2c19.4 31.8 32.3 69.6 34.6 110.2-2.3 40.6-15.2 78.4-34.6 110.2h-1.2zM244 500c66.7 0 123.6-43.5 146.1-103.1H97.9C120.4 456.5 177.3 500 244 500zM449.2 327.4c-21.6-32-34.1-70-34.1-111.4s12.5-79.4 34.1-111.4h1.2c19.4 31.8 32.3 69.6 34.6 110.2-2.3 40.6-15.2 78.4-34.6 110.2h-1.2zM244 20c66.7 0 123.6 43.5 146.1 103.1H97.9C120.4 63.5 177.3 20 244 20z"></path>
  </svg>
);


export default function SignInForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleEmailSignIn = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push('/');
    } catch (error: any) {
       if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        toast({
          title: 'Sign In Failed',
          description: (
            <span>
              Invalid credentials. Don't have an account?{' '}
              <Link href="/auth/signup" className="font-bold text-primary-foreground underline">
                Sign Up
              </Link>
            </span>
          ),
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
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error('Error signing in with Google', error);
       toast({
        title: 'Sign In Failed',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePasswordReset = async () => {
    const email = form.getValues('email');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        toast({
            title: 'Invalid Email',
            description: 'Please enter a valid email address to reset your password.',
            variant: 'destructive',
        });
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        toast({
            title: 'Password Reset Email Sent',
            description: 'If an account exists for this email, you will receive a password reset link.',
        });
    } catch (error: any) {
        toast({
            title: 'Password Reset Failed',
            description: error.message,
            variant: 'destructive',
        });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Sign in to continue to your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
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
                        <FormLabel>Password</FormLabel>
                         <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-sm"
                            onClick={handlePasswordReset}
                        >
                            Forgot Password?
                        </Button>
                    </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button className="w-full" variant="outline" onClick={handleGoogleSignIn}>
          <GoogleIcon />
          Sign in with Google
        </Button>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <p>
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
