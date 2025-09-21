
'use client';

import Link from 'next/link';
import { Menu, Stethoscope, UserCog, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/ai-recommendations', label: 'AI Recommendations' },
];

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const NavLinks = ({
    className,
    onLinkClick,
  }: {
    className?: string;
    onLinkClick?: () => void;
  }) => (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === link.href ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline inline-block">HealthConnect</span>
        </Link>
        
        <div className="flex-1 items-center hidden md:flex">
          <NavLinks />
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
           <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost">
                  <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                </Button>
                <Button onClick={logout} variant="outline">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login"><LogIn className="mr-2 h-4 w-4" />Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" />Sign Up</Link>
                </Button>
              </>
            )}
             <Button asChild variant="secondary">
                <Link href="/admin">
                    <UserCog className="mr-2 h-4 w-4" />
                    Admin
                </Link>
             </Button>
           </div>

          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-headline">Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through the HealthConnect app.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 pt-6">
                  <NavLinks className="flex-col space-x-0 space-y-4 items-start" />
                  <div className="border-t pt-4 space-y-2">
                     {user ? (
                        <>
                          <Button asChild variant="ghost" className="w-full justify-start">
                            <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                          </Button>
                           <Button onClick={logout} variant="outline" className="w-full justify-start">
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button asChild variant="ghost" className="w-full justify-start">
                            <Link href="/login"><LogIn className="mr-2 h-4 w-4" />Login</Link>
                          </Button>
                          <Button asChild className="w-full justify-start">
                            <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" />Sign Up</Link>
                          </Button>
                        </>
                      )}
                    <Button asChild variant="ghost" className="justify-start">
                      <Link href="/admin">
                          <UserCog className="mr-2 h-4 w-4" />
                          Admin Panel
                      </Link>
                   </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </header>
  );
}
