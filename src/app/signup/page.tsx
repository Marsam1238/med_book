
'use client';

import { useState, useEffect } from 'react';
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
import { toast } from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const { user, updateUserProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not logged in or already has a name, redirect
    if (!loading && (!user || user.name)) {
      router.push('/profile');
    }
  }, [user, loading, router]);


  const handleProfileUpdate = () => {
    if(!name || !address) {
        toast.error("Please fill in all fields.");
        return;
    }
    updateUserProfile({ name, address });
  };
  
  if (loading || !user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <UserPlus className="h-6 w-6" /> Complete Your Profile
          </CardTitle>
          <CardDescription>
            Just a few more details to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={user.phoneNumber || ''}
                disabled
              />
            </div>
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
            <Button onClick={handleProfileUpdate} className="w-full">
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
