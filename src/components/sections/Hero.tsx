import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchTabs } from '@/components/shared/SearchTabs';

export default function Hero() {
  return (
    <section className="relative w-full py-20 md:py-32 bg-gradient-to-r from-primary via-blue-500 to-accent">
      <div className="container mx-auto px-4 md:px-6 text-center text-primary-foreground">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
          Your Health, Your Way
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl font-body">
          Instantly find doctors, book lab tests, and manage your health with ease.
        </p>

        <Card className="mt-10 max-w-2xl mx-auto shadow-2xl">
          <CardContent className="p-4 md:p-6">
            <SearchTabs />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
