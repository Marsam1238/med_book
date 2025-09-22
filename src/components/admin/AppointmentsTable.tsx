
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
import { CheckCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/context/AuthContext';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';

const mockAppointments: Appointment[] = [
  { id: 1, user: 'Alice Johnson', item: 'Dr. Emily Carter', type: 'Doctor', date: '2024-08-15', time: '10:00 AM', status: 'Pending' },
  { id: 2, user: 'Bob Williams', item: 'Complete Blood Count (CBC)', type: 'Lab Test', date: '2024-08-16', time: '09:00 AM', status: 'Pending' },
  { id: 3, user: 'Charlie Brown', item: 'Dr. Ben Adams', type: 'Doctor', date: '2024-08-16', time: '02:00 PM', status: 'Confirmed', clinic: 'Downtown Clinic', ticketNumber: 'A101', fees: '$150', address: '123 Main St' },
];

export function AppointmentsTable() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
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

  const openDetailsModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSaveDetails = (updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt));
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
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map(apt => (
                <TableRow key={apt.id}>
                  <TableCell>{apt.user}</TableCell>
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
            appointment={selectedAppointment}
            onSave={handleSaveDetails}
        />
      )}
    </>
  );
}
