
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bell, Loader2, LogIn, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemType: 'Doctor' | 'Lab Test';
  itemName: string;
}

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

export function BookingModal({
  isOpen,
  onClose,
  title,
  itemType,
  itemName,
}: BookingModalProps) {
  const { toast } = useToast();
  const { user, addAppointment } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleBooking = () => {
    if (!date || !time) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a date and time to book an appointment.',
      });
      return;
    }

    setIsConfirming(true);
    setTimeout(() => {

      addAppointment({
        item: itemName,
        type: itemType,
        date: date.toLocaleDateString(),
        time: time,
      });

      setIsConfirming(false);
      onClose();
      toast({
        title: 'Booking Confirmed!',
        description: `Your appointment for ${itemName} is set for ${date.toLocaleDateString()} at ${time}.`,
      });
    }, 1500);
  };

  if (!isOpen) {
    return null;
  }
  
  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
         {!user ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline">Login Required</DialogTitle>
                <DialogDescription>
                  You need to be logged in to book an appointment.
                </DialogDescription>
              </DialogHeader>
              <Button onClick={() => router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}>
                <LogIn className="mr-2" />
                Go to Login
              </Button>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline">{title}</DialogTitle>
                <DialogDescription>
                  Confirm your details and select a date and time.
                </DialogDescription>
              </Header>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={user.name || 'Anonymous'}
                    className="col-span-3"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    className="col-span-3"
                    disabled
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                  <div className="flex-grow space-y-2">
                    <Label>Time</Label>
                    <Select onValueChange={setTime} value={time}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleBooking} disabled={isConfirming} className="w-full">
                  {isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </DialogFooter>
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2 pt-2">
                  <Bell className="h-4 w-4" /> You'll receive an email reminder 24 hours before your appointment.
              </p>
            </>
          )}
        </DialogContent>
    </Dialog>
  );
}
