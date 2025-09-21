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
import { Button } from '@/components/ui/button';
import { labTests as initialLabTests } from '@/lib/data';
import type { LabTest } from '@/lib/data';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { LabTestFormModal } from './LabTestFormModal';

export function LabTestsTable() {
  const [labTests, setLabTests] = useState<LabTest[]>(initialLabTests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  const handleSave = (test: LabTest) => {
    if (selectedTest) {
      setLabTests(labTests.map(t => t.id === test.id ? test : t));
    } else {
      const newTest = { ...test, id: Math.max(...labTests.map(t => t.id)) + 1 };
      setLabTests([...labTests, newTest]);
    }
  };

  const handleDelete = (id: number) => {
    setLabTests(labTests.filter(t => t.id !== id));
  };
  
  const openModal = (test: LabTest | null = null) => {
      setSelectedTest(test);
      setIsModalOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Lab Tests</CardTitle>
        <Button onClick={() => openModal()}>
          <PlusCircle className="mr-2" /> Add Lab Test
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labTests.map(test => (
              <TableRow key={test.id}>
                <TableCell>{test.name}</TableCell>
                <TableCell>{test.category}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => openModal(test)}>
                    <Edit />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(test.id)}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {isModalOpen && (
        <LabTestFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          test={selectedTest}
        />
      )}
    </Card>
  );
}
