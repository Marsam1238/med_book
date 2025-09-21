
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

export default function SignupPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const { user, updateUserDetails } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user) {
     // Not logged in via OTP yet, show a message or redirect.
      return (
         <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 bg-background">
            <Card className="mx-auto max-w-sm w-full text-center">
                 <CardHeader>
                    <CardTitle className="text-2xl font-headline">Complete Your Profile</CardTitle>
                    <CardDescription>
                        Please log in with your phone number first to create an account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/login">Go to Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      )
  }

  const handleProfileUpdate = () => {
    if (!name || !address) {
        alert("Please fill in all fields.");
        return;
    }
    setLoading(true);
    try {
        updateUserDetails({ name, address });
        // Redirect is handled in AuthContext
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <UserPlus className="h-6 w-6" /> Complete Your Account
          </CardTitle>
          <CardDescription>
            You're almost there! Just add your details. Your phone number is {user.phoneNumber}.
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
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="123 Main St, Anytown, USA"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button onClick={handleProfileUpdate} disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save and Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
