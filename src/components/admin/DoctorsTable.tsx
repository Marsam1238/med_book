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
import { Button } from '@/components/ui/button';
import { doctors as initialDoctors, doctorSpecializations } from '@/lib/data';
import type { Doctor } from '@/lib/data';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { DoctorFormModal } from './DoctorFormModal';

export function DoctorsTable() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleSave = (doctor: Doctor) => {
    if (selectedDoctor) {
      setDoctors(doctors.map(d => d.id === doctor.id ? doctor : d));
    } else {
      const newDoctor = { ...doctor, id: Math.max(...doctors.map(d => d.id)) + 1 };
      setDoctors([...doctors, newDoctor]);
    }
  };

  const handleDelete = (id: number) => {
    setDoctors(doctors.filter(d => d.id !== id));
  };
  
  const openModal = (doctor: Doctor | null = null) => {
      setSelectedDoctor(doctor);
      setIsModalOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Doctors</CardTitle>
        <Button onClick={() => openModal()}>
          <PlusCircle className="mr-2" /> Add Doctor
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map(doctor => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.experience}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => openModal(doctor)}>
                    <Edit />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(doctor.id)}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {isModalOpen && (
        <DoctorFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          doctor={selectedDoctor}
        />
      )}
    </Card>
  );
}
