
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
import { Appointment, useAuth } from '@/context/AuthContext';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';


export function AppointmentsTable() {
  const { allAppointments, updateAppointment } = useAuth();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleConfirm = (id: number) => {
    const appointmentToUpdate = allAppointments.find(apt => apt.id === id);
    if(appointmentToUpdate) {
        updateAppointment({ ...appointmentToUpdate, status: 'Confirmed' });
        toast({
            title: 'Appointment Confirmed',
            description: `Appointment #${id} has been marked as confirmed.`,
        })
    }
  };

  const openDetailsModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSaveDetails = (updatedAppointment: Appointment) => {
    updateAppointment(updatedAppointment);
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
              {allAppointments.map(apt => (
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
            appointment={selectedAppointment}
            onSave={handleSaveDetails}
        />
      )}
    </>
  );
}
