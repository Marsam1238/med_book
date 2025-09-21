
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import Link from 'next/link';
import { LogIn, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginWithPhone, verifyOtp } = useAuth();
  const router = useRouter();

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    await loginWithPhone(phone);
    setLoading(false);
    setOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP.');
        return;
    }
    setLoading(true);
    try {
        await verifyOtp(otp);
        // On success, the AuthContext will redirect
    } catch (error) {
        // Error is handled in AuthContext
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <LogIn className="h-6 w-6" /> Login
          </CardTitle>
          <CardDescription>
            Enter your phone number to receive an OTP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button onClick={handleSendOtp} disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          ) : (
             <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <Button onClick={handleVerifyOtp} disabled={loading} className="w-full">
                   {loading ? 'Verifying...' : 'Verify OTP & Login'}
                </Button>
                 <Button variant="link" size="sm" onClick={() => setOtpSent(false)} className="text-sm">
                    Back to phone number
                </Button>
             </div>
          )}
           <div className="mt-4 text-center text-sm">
            This site uses reCAPTCHA for security.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
