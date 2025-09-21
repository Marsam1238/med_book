'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockAppointments = [
  { id: 1, user: 'Alice Johnson', item: 'Dr. Emily Carter', type: 'Doctor', date: '2024-08-15', time: '10:00 AM', status: 'Pending' },
  { id: 2, user: 'Bob Williams', item: 'Complete Blood Count (CBC)', type: 'Lab Test', date: '2024-08-16', time: '09:00 AM', status: 'Pending' },
  { id: 3, user: 'Charlie Brown', item: 'Dr. Ben Adams', type: 'Doctor', date: '2024-08-16', time: '02:00 PM', status: 'Confirmed' },
];

export function AppointmentsTable() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const { toast } = useToast();

  const handleConfirm = (id: number) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id ? { ...apt, status: 'Confirmed' } : apt
      )
    );
    toast({
        title: 'Appointment Confirmed',
        description: `Appointment #${id} has been marked as confirmed.`,
    })
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map(apt => (
              <TableRow key={apt.id}>
                <TableCell>{apt.user}</TableCell>
                <TableCell>{apt.item}</TableCell>
                <TableCell>{apt.type}</TableCell>
                <TableCell>{apt.date} at {apt.time}</TableCell>
                <TableCell>
                  <Badge variant={apt.status === 'Confirmed' ? 'default' : 'secondary'} className={apt.status === 'Confirmed' ? 'bg-green-600' : ''}>
                    {apt.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {apt.status === 'Pending' && (
                    <Button size="sm" onClick={() => handleConfirm(apt.id)}>
                      <CheckCircle className="mr-2" />
                      Confirm
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
