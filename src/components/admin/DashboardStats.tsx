
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function DashboardStats() {
  const { allAppointments } = useAuth();
  const [stats, setStats] = useState({
    todaysAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    
    const todaysAppointments = allAppointments.filter(apt => apt.date === today).length;
    const confirmedAppointments = allAppointments.filter(apt => apt.status === 'Confirmed').length;
    
    // Mock data for prescriptions as it's not in the main data flow yet
    const mockPrescriptions = [
      { id: 1, status: 'Pending Review' },
      { id: 2, status: 'Approved' },
      { id: 3, status: 'Rejected' },
      { id: 4, status: 'Approved' },
    ];
    const approvedPrescriptions = mockPrescriptions.filter(p => p.status === 'Approved').length;
    const rejectedPrescriptions = mockPrescriptions.filter(p => p.status === 'Rejected').length;


    setStats({
      todaysAppointments,
      confirmedAppointments,
      approvedPrescriptions,
      rejectedPrescriptions
    });

  }, [allAppointments]);

  const statCards = [
    { title: "Today's Appointments", value: stats.todaysAppointments, icon: <Calendar className="h-6 w-6 text-primary" />, color: "text-primary" },
    { title: "Confirmed Appointments", value: stats.confirmedAppointments, icon: <CheckCircle className="h-6 w-6 text-green-500" />, color: "text-green-500" },
    { title: "Approved Prescriptions", value: stats.approvedPrescriptions, icon: <CheckCircle className="h-6 w-6 text-blue-500" />, color: "text-blue-500" },
    { title: "Rejected Prescriptions", value: stats.rejectedPrescriptions, icon: <XCircle className="h-6 w-6 text-destructive" />, color: "text-destructive" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map(card => (
            <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    {card.icon}
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                    <p className="text-xs text-muted-foreground">Total count of {card.title.toLowerCase()}</p>
                </CardContent>
            </Card>
        ))}
    </div>
  );
}
