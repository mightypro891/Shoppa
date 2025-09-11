
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';


const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type SignUpFormValues = z.infer<typeof formSchema>;


const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8C0 120.3 106.5 8 244 8s244 112.3 244 253.8zM138.3 327.4c-21.6-32-34.1-70-34.1-111.4s12.5-79.4 34.1-111.4h1.2c19.4 31.8 32.3 69.6 34.6 110.2-2.3 40.6-15.2 78.4-34.6 110.2h-1.2zM244 500c66.7 0 123.6-43.5 146.1-103.1H97.9C120.4 456.5 177.3 500 244 500zM449.2 327.4c-21.6-32-34.1-70-34.1-111.4s12.5-79.4 34.1-111.4h1.2c19.4 31.8 32.3 69.6 34.6 110.2-2.3 40.6-15.2 78.4-34.6 110.2h-1.2zM244 20c66.7 0 123.6 43.5 146.1 103.1H97.9C120.4 63.5 177.3 20 244 20z"></path>
  </svg>
);


export default function SignUpForm() {
  const router = useRouter();
  const { googleSignIn, emailSignUp } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleSuccessfulLogin = (isNewUser: boolean) => {
    if (isNewUser) {
      router.push('/auth/welcome');
    } else {
      router.push('/');
    }
  }

  const onSubmit = async (data: SignUpFormValues) => {
      setIsSubmitting(true);
      try {
          const { isNewUser } = await emailSignUp(data.name, data.email, data.password);
          handleSuccessfulLogin(isNewUser);
      } catch (error: any) {
          toast({
              title: 'Sign Up Failed',
              description: error.message,
              variant: 'destructive',
          });
      } finally {
        setIsSubmitting(false);
      }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const { isNewUser } = await googleSignIn();
      handleSuccessfulLogin(isNewUser);
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
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Enter your details to get started.</CardDescription>
      </CardHeader>
      <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="name@example.com" {...field} />
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
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                            <FormControl>
                                <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                            </FormControl>
                             <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </Button>
            </form>
          </Form>

          <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
              Or continue with
              </span>
          </div>
          </div>
          <Button className="w-full" variant="outline" onClick={handleGoogleSignIn} disabled={isSubmitting}>
            <GoogleIcon />
            Sign in with Google
          </Button>
      </CardContent>
       <CardFooter className="flex justify-center text-sm">
            <p>Already have an account?&nbsp;</p>
            <Link href="/auth/signin" className="text-primary hover:underline">
             Sign In
            </Link>
      </CardFooter>
    </Card>
  );
}
