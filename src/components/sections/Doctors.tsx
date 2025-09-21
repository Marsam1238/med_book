'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DoctorCard } from '@/components/shared/DoctorCard';
import { doctors, doctorSpecializations } from '@/lib/data';
import type { Doctor } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BookingModal } from '../shared/BookingModal';

export default function Doctors() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const specialization = searchParams.get('specialization');
    if (specialization && doctorSpecializations.map(s => s.toLowerCase()).includes(specialization.toLowerCase())) {
      const matchingSpecialization = doctorSpecializations.find(s => s.toLowerCase() === specialization.toLowerCase());
      if(matchingSpecialization) {
        setFilter(matchingSpecialization);
      }
    } else {
        setFilter('All');
    }
  }, [searchParams]);

  const filteredDoctors =
    filter === 'All'
      ? doctors
      : doctors.filter((doctor) => doctor.specialization === filter);

  const handleBookNow = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <section id="doctors" className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
            Our Expert Doctors
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find the right specialist for your needs from our team of dedicated professionals.
          </p>
        </div>

        <div className="mt-10 flex justify-center flex-wrap gap-2">
          {doctorSpecializations.map((specialization) => (
            <Button
              key={specialization}
              variant={filter === specialization ? 'default' : 'outline'}
              onClick={() => setFilter(specialization)}
              className={cn('rounded-full', {
                'shadow-md': filter === specialization,
              })}
            >
              {specialization}
            </Button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookNow={() => handleBookNow(doctor)}
            />
          ))}
        </div>
      </div>
      {selectedDoctor && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Book Appointment with ${selectedDoctor.name}`}
          itemType='Doctor'
          itemName={selectedDoctor.name}
        />
      )}
    </section>
  );
}
