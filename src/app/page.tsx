import Hero from '@/components/sections/Hero';
import Doctors from '@/components/sections/Doctors';
import LabTests from '@/components/sections/LabTests';
import Features from '@/components/sections/Features';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Doctors />
      <LabTests />
    </>
  );
}
