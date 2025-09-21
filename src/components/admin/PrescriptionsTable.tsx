'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Download, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockPrescriptions = [
  { id: 1, user: 'John Doe', fileName: 'prescription-johndoe.pdf', purpose: 'Lab Test', status: 'Pending Review' },
  { id: 2, user: 'Jane Smith', fileName: 'meds-jane.jpg', purpose: 'Medicine', status: 'Approved' },
  { id: 3, user: 'Sam Wilson', fileName: 'scan_request.png', purpose: 'Lab Test', status: 'Rejected' },
];

export function PrescriptionsTable() {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const { toast } = useToast();

  const handleAction = (id: number, status: 'Approved' | 'Rejected') => {
    setPrescriptions(prev =>
      prev.map(p => (p.id === id ? { ...p, status } : p))
    );
    toast({
      title: `Prescription ${status}`,
      description: `Prescription #${id} has been ${status.toLowerCase()}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Prescriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.user}</TableCell>
                <TableCell className="flex items-center gap-2">
                    {p.fileName}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Download />
                    </Button>
                </TableCell>
                <TableCell>{p.purpose}</TableCell>
                <TableCell>
                  <Badge variant={p.status === 'Approved' ? 'default' : p.status === 'Rejected' ? 'destructive' : 'secondary'}
                   className={p.status === 'Approved' ? 'bg-green-600' : ''}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  {p.status === 'Pending Review' && (
                    <>
                      <Button size="sm" onClick={() => handleAction(p.id, 'Approved')}>
                        <Check className="mr-2" /> Approve
                      </Button>
                       <Button size="sm" variant="destructive" onClick={() => handleAction(p.id, 'Rejected')}>
                        <AlertCircle className="mr-2" /> Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
