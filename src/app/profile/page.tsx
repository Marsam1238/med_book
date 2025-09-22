
'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Phone, Home, Building, Ticket, DollarSign, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, appointments, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // or a loading spinner
  }

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader className="text-center">
             <Avatar className="mx-auto h-24 w-24 mb-4 text-3xl">
                <AvatarFallback>{getInitials(user.name || '')}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-headline">{user.name || 'Welcome!'}</CardTitle>
            <CardDescription>{user.name ? 'Your personal account details.' : 'Please complete your profile.'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                    <p className="text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{user.phone}</p>
                </div>
            </div>
            {user.address && (
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm">
                        <p className="text-muted-foreground">Address</p>
                        <p className="font-medium">{user.address}</p>
                    </div>
                </div>
            )}
             {!user.name && (
              <Button onClick={() => router.push('/signup')} className="w-full">
                Complete Your Profile
              </Button>
            )}
            
            <Card className="mt-8 bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-xl font-headline">My Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    {appointments.length > 0 ? (
                       <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Appointment</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {appointments.map(apt => (
                              <TableRow key={apt.id}>
                                <TableCell>
                                    <p className="font-bold">{apt.item}</p>
                                    <p className="text-sm text-muted-foreground">{apt.date} at {apt.time}</p>
                                </TableCell>
                                <TableCell className="space-y-1">
                                  {apt.clinic && <p className="flex items-center gap-2 text-sm"><Building className="h-4 w-4" /> {apt.clinic}</p>}
                                  {apt.address && <p className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" /> {apt.address}</p>}
                                  {apt.ticketNumber && <p className="flex items-center gap-2 text-sm"><Ticket className="h-4 w-4" /> Ticket: {apt.ticketNumber}</p>}
                                  {apt.fees && <p className="flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4" /> Fees: {apt.fees}</p>}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={apt.status === 'Confirmed' ? 'default' : 'secondary'} className={apt.status === 'Confirmed' ? 'bg-green-600' : ''}>
                                    {apt.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">You have no upcoming appointments.</p>
                    )}
                </CardContent>
            </Card>
             <Button onClick={logout} variant="outline" className="w-full mt-4">
                Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
