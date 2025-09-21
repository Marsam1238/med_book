import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LabTest } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Beaker } from 'lucide-react';

interface LabTestCardProps {
  test: LabTest;
  onBookTest: (test: LabTest) => void;
}

export function LabTestCard({ test, onBookTest }: LabTestCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === test.image);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          src={placeholder?.imageUrl || `https://picsum.photos/seed/lab${test.id}/600/400`}
          alt={`Image for ${test.name}`}
          width={600}
          height={400}
          className="w-full h-auto aspect-[3/2] object-cover"
          data-ai-hint={placeholder?.imageHint || 'medical test'}
        />
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-headline">{test.name}</CardTitle>
        <Badge variant="secondary" className="mt-2">{test.category}</Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onBookTest(test)} className="w-full">
          <Beaker className="mr-2 h-4 w-4" />
          Book Test
        </Button>
      </CardFooter>
    </Card>
  );
}
