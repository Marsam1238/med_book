
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
import { CheckCircle, Edit, Home, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/context/AuthContext';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';

const mockAppointments: (Omit<Appointment, 'user'> & { user: { name: string; phone: string; address: string; } })[] = [
  { id: 1, user: { name: 'Alice Johnson', phone: '555-0101', address: '123 Maple St, Springfield' }, item: 'Dr. Emily Carter', type: 'Doctor', date: '2024-08-15', time: '10:00 AM', status: 'Pending' },
  { id: 2, user: { name: 'Bob Williams', phone: '555-0102', address: '456 Oak Ave, Metropolis' }, item: 'Complete Blood Count (CBC)', type: 'Lab Test', date: '2024-08-16', time: '09:00 AM', status: 'Pending' },
  { id: 3, user: { name: 'Charlie Brown', phone: '555-0103', address: '789 Pine Ln, Gotham' }, item: 'Dr. Ben Adams', type: 'Doctor', date: '2024-08-16', time: '02:00 PM', status: 'Confirmed', clinic: 'Downtown Clinic', ticketNumber: 'A101', fees: '$150', address: '123 Main St' },
];

export function AppointmentsTable() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<(Omit<Appointment, 'user'> & { user: { name: string; phone: string; address: string; } }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const openDetailsModal = (appointment: (Omit<Appointment, 'user'> & { user: { name: string; phone: string; address: string; } })) => {
    // We need to cast this back to Appointment for the modal
    const modalAppointment: Appointment = {
      ...appointment,
      user: appointment.user.name,
    };
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSaveDetails = (updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(apt => {
        if (apt.id === updatedAppointment.id) {
            // Find the original user object to preserve it
            const originalApt = prev.find(p => p.id === updatedAppointment.id);
            return { ...apt, ...updatedAppointment, user: originalApt?.user || { name: updatedAppointment.user, phone: '', address: '' } };
        }
        return apt;
    }));
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Details</TableHead>
                <TableHead>Appointment Details</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map(apt => (
                <TableRow key={apt.id}>
                  <TableCell>
                    <div className="font-semibold">{apt.user.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4" /> {apt.user.phone}
                    </div>
                     <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Home className="h-4 w-4" /> {apt.user.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{apt.item}</p>
                    {apt.clinic && <p className="text-sm text-muted-foreground">{apt.clinic}</p>}
                    {apt.ticketNumber && <p className="text-sm text-muted-foreground">Ticket: {apt.ticketNumber}</p>}
                  </TableCell>
                  <TableCell>{apt.type}</TableCell>
                  <TableCell>{apt.date} at {apt.time}</TableCell>
                  <TableCell>
                    <Badge variant={apt.status === 'Confirmed' ? 'default' : 'secondary'} className={apt.status === 'Confirmed' ? 'bg-green-600' : ''}>
                      {apt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    {apt.status === 'Pending' && (
                      <Button size="sm" onClick={() => handleConfirm(apt.id)}>
                        <CheckCircle className="mr-2" />
                        Confirm
                      </Button>
                    )}
                     <Button size="sm" variant="outline" onClick={() => openDetailsModal(apt)}>
                        <Edit className="mr-2" />
                        Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedAppointment && (
        <AppointmentDetailsModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            appointment={{...selectedAppointment, user: selectedAppointment.user.name}}
            onSave={handleSaveDetails}
        />
      )}
    </>
  );
}
