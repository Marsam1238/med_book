
'use client';

import { useState } from 'react';
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
import { LogIn, MessageSquareQuote } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { loginWithPhone, verifyOtp } = useAuth();

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      // Basic validation
      alert('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      await loginWithPhone(phone);
      setOtpSent(true);
    } catch (error) {
      // Error is handled in AuthContext via toast
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
     if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(otp);
      // On success, the AuthContext will redirect
    } catch (error) {
      // Error is handled in AuthContext via toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <LogIn className="h-6 w-6" /> {otpSent ? 'Enter OTP' : 'Login with Phone'}
          </CardTitle>
          <CardDescription>
            {otpSent ? 'An OTP has been sent to your phone.' : 'Enter your phone number to login or create an account.'}
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
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </div>
          ) : (
             <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <Button onClick={handleVerifyOtp} disabled={loading} className="w-full">
                {loading ? 'Verifying...' : 'Verify OTP & Login'}
              </Button>
              <Button variant="link" onClick={() => setOtpSent(false)} disabled={loading}>
                Back to phone number
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
