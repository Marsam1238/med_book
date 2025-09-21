import { Stethoscope } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline inline-block">HealthConnect</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HealthConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
