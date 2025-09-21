import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Doctor } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, Medal } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onBookNow: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onBookNow }: DoctorCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === doctor.image);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          src={placeholder?.imageUrl || `https://picsum.photos/seed/${doctor.id}/400/400`}
          alt={`Photo of ${doctor.name}`}
          width={400}
          height={400}
          className="w-full h-auto aspect-square object-cover"
          data-ai-hint={placeholder?.imageHint || 'doctor portrait'}
        />
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-headline">{doctor.name}</CardTitle>
        <Badge variant="secondary" className="mt-2">{doctor.specialization}</Badge>
        <div className="mt-3 flex items-center text-sm text-muted-foreground">
          <Medal className="w-4 h-4 mr-2" />
          <span>{doctor.experience} of experience</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onBookNow(doctor)} className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}
