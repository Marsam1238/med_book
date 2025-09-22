
import { Suspense } from 'react';
import Hero from '@/components/sections/Hero';
import Doctors from '@/components/sections/Doctors';
import LabTests from '@/components/sections/LabTests';
import Features from '@/components/sections/Features';
import { Skeleton } from '@/components/ui/skeleton';

function DoctorsSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 sm:py-20">
      <div className="text-center">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
      </div>
      <div className="mt-10 flex justify-center flex-wrap gap-2">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[450px] rounded-lg" />)}
      </div>
    </div>
  )
}

function LabTestsSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 sm:py-20">
      <div className="text-center">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
      </div>
       <div className="mt-10 flex justify-center flex-wrap gap-2">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[400px] rounded-lg" />)}
      </div>
    </div>
  )
}


export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Suspense fallback={<DoctorsSkeleton />}>
        <Doctors />
      </Suspense>
      <Suspense fallback={<LabTestsSkeleton />}>
        <LabTests />
      </Suspense>
    </>
  );
}
