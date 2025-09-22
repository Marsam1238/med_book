
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!phone || !password || !name || !address) {
        toast({
            variant: 'destructive',
            title: 'Missing Fields',
            description: 'Please fill in all fields.',
        });
        return;
    }
     if (phone.length !== 10) {
      toast({
        variant: 'destructive',
        title: 'Invalid Phone Number',
        description: 'Phone number must be 10 digits.',
      });
      return;
    }
    setLoading(true);
    try {
        await signup(phone, password, { name, address });
        // Redirect is handled in AuthContext
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: error.message,
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <UserPlus className="h-6 w-6" /> Create an Account
          </CardTitle>
          <CardDescription>
            Enter your details to create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number (10 digits)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="1234567890"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="123 Main St, Anytown, USA"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button onClick={handleSignup} disabled={loading} className="w-full">
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
