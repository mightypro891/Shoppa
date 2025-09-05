
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SignUpForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Sign Up Disabled</CardTitle>
        <CardDescription>This is a prototype application. User creation is disabled.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/auth/signin">Go to Login</Link>
          </Button>
      </CardContent>
       <CardFooter className="justify-center text-sm">
        <p>
          Please use the prototype login page to explore the app.
        </p>
      </CardFooter>
    </Card>
  );
}
