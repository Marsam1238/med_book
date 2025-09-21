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
import { LabTest, labTestCategories } from '@/lib/data';

interface LabTestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (test: LabTest) => void;
  test: LabTest | null;
}

export function LabTestFormModal({ isOpen, onClose, onSave, test }: LabTestFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<LabTest, 'id' | 'image'>>({
    name: '',
    category: '',
  });

  useEffect(() => {
    if (test) {
      setFormData({
        name: test.name,
        category: test.category,
      });
    } else {
      setFormData({ name: '', category: '' });
    }
  }, [test]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all fields.',
      });
      return;
    }

    onSave({
        ...formData,
        id: test?.id || 0,
        image: test?.image || `lab-test-${Math.floor(Math.random() * 100)}`
    });
    onClose();
    toast({
      title: `Lab Test ${test ? 'Updated' : 'Added'}`,
      description: `${formData.name} has been successfully saved.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{test ? 'Edit Lab Test' : 'Add New Lab Test'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the lab test.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select onValueChange={handleSelectChange} value={formData.category}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {labTestCategories.filter(c => c !== 'All').map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Lab Test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
