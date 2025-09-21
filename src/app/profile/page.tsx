
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
import { User, Mail, Home, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ProfilePage() {
  const { user, appointments } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null; // or a loading spinner
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader className="text-center">
             <Avatar className="mx-auto h-24 w-24 mb-4 text-3xl">
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
            <CardDescription>Your personal account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Home className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">{user.address}</p>
                </div>
            </div>
            
            <Card className="mt-8 bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-xl font-headline">My Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    {appointments.length > 0 ? (
                       <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {appointments.map(apt => (
                              <TableRow key={apt.id}>
                                <TableCell>{apt.item}</TableCell>
                                <TableCell>{apt.type}</TableCell>
                                <TableCell>{apt.date} at {apt.time}</TableCell>
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
                        <p className="text-muted-foreground">You have no upcoming appointments.</p>
                    )}
                </CardContent>
            </Card>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
