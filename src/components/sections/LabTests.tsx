'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { LabTestCard } from '@/components/shared/LabTestCard';
import { labTests, labTestCategories } from '@/lib/data';
import type { LabTest } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BookingModal } from '../shared/BookingModal';

export default function LabTests() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

   useEffect(() => {
    const category = searchParams.get('category');
    if (category && labTestCategories.map(c => c.toLowerCase()).includes(category.toLowerCase())) {
       const matchingCategory = labTestCategories.find(c => c.toLowerCase() === category.toLowerCase());
      if(matchingCategory) {
        setFilter(matchingCategory);
      }
    } else {
        setFilter('All');
    }
  }, [searchParams]);

  const filteredTests =
    filter === 'All'
      ? labTests
      : labTests.filter((test) => test.category === filter);

  const handleBookTest = (test: LabTest) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };
  
  return (
    <section id="lab-tests" className="py-16 sm:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
            Available Lab Tests
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Book a wide range of tests from the comfort of your home.
          </p>
        </div>

        <div className="mt-10 flex justify-center flex-wrap gap-2">
          {labTestCategories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
              className={cn('rounded-full', {
                'shadow-md': filter === category,
              })}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => (
            <LabTestCard
              key={test.id}
              test={test}
              onBookTest={() => handleBookTest(test)}
            />
          ))}
        </div>
      </div>
      {selectedTest && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Book Lab Test: ${selectedTest.name}`}
          itemType="Lab Test"
          itemName={selectedTest.name}
        />
      )}
    </section>
  );
}
