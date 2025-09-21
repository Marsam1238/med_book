import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";
import { DoctorsTable } from "@/components/admin/DoctorsTable";
import { LabTestsTable } from "@/components/admin/LabTestsTable";
import { PrescriptionsTable } from "@/components/admin/PrescriptionsTable";
import { Calendar, Stethoscope, Microscope, FileText } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="container py-12 md:py-16">
            <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl mb-8">Admin Dashboard</h1>

            <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                    <TabsTrigger value="appointments" className="flex-col sm:flex-row gap-2 py-2">
                        <Calendar /> Appointments
                    </TabsTrigger>
                    <TabsTrigger value="doctors" className="flex-col sm:flex-row gap-2 py-2">
                        <Stethoscope /> Doctors
                    </TabsTrigger>
                    <TabsTrigger value="lab_tests" className="flex-col sm:flex-row gap-2 py-2">
                        <Microscope /> Lab Tests
                    </TabsTrigger>
                    <TabsTrigger value="prescriptions" className="flex-col sm:flex-row gap-2 py-2">
                        <FileText /> Prescriptions
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="appointments">
                    <AppointmentsTable />
                </TabsContent>
                <TabsContent value="doctors">
                    <DoctorsTable />
                </TabsContent>
                <TabsContent value="lab_tests">
                    <LabTestsTable />
                </TabsContent>
                <TabsContent value="prescriptions">
                    <PrescriptionsTable />
                </TabsContent>
            </Tabs>
        </div>
    )
}
