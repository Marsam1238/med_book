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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Doctor, doctorSpecializations } from '@/lib/data';

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doctor: Doctor) => void;
  doctor: Doctor | null;
}

export function DoctorFormModal({ isOpen, onClose, onSave, doctor }: DoctorFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Doctor, 'id' | 'image'>>({
    name: '',
    specialization: '',
    experience: '',
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name,
        specialization: doctor.specialization,
        experience: doctor.experience,
      });
    } else {
      setFormData({ name: '', specialization: '', experience: '' });
    }
  }, [doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, specialization: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.specialization || !formData.experience) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all fields.',
      });
      return;
    }

    onSave({
        ...formData,
        id: doctor?.id || 0,
        image: doctor?.image || `doctor-${Math.floor(Math.random() * 100)}`
    });
    onClose();
    toast({
      title: `Doctor ${doctor ? 'Updated' : 'Added'}`,
      description: `${formData.name} has been successfully saved.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{doctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the doctor.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialization" className="text-right">Specialization</Label>
            <Select onValueChange={handleSelectChange} value={formData.specialization}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a specialization" />
                </SelectTrigger>
                <SelectContent>
                    {doctorSpecializations.filter(s => s !== 'All').map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="experience" className="text-right">Experience</Label>
            <Input id="experience" value={formData.experience} onChange={handleChange} className="col-span-3" placeholder="e.g. 10 years"/>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Doctor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
