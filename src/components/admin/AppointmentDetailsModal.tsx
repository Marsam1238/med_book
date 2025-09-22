
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
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/context/AuthContext';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  appointment: Appointment;
}

export function AppointmentDetailsModal({ isOpen, onClose, onSave, appointment }: AppointmentDetailsModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Appointment>>({});

  useEffect(() => {
    if (appointment) {
      setFormData({
        clinic: appointment.clinic || '',
        ticketNumber: appointment.ticketNumber || '',
        fees: appointment.fees || '',
        address: appointment.address || '',
      });
    }
  }, [appointment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const updatedAppointment: Appointment = { ...appointment, ...formData };
    onSave(updatedAppointment);
    onClose();
    toast({
      title: `Appointment Details Updated`,
      description: `Details for appointment #${appointment.id} have been saved.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Appointment Details</DialogTitle>
          <DialogDescription>
            Add or update details for the appointment with {appointment.user.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clinic" className="text-right">Clinic/Shop</Label>
            <Input id="clinic" value={formData.clinic} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Clinic Address</Label>
            <Input id="address" value={formData.address} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ticketNumber" className="text-right">Ticket No.</Label>
            <Input id="ticketNumber" value={formData.ticketNumber} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fees" className="text-right">Fees</Label>
            <Input id="fees" value={formData.fees} onChange={handleChange} className="col-span-3" placeholder="e.g. $50"/>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
