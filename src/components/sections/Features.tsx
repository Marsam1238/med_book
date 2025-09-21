import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Beaker, Sparkles, UserCheck } from 'lucide-react';

const features = [
  {
    icon: <Stethoscope className="w-10 h-10 text-primary" />,
    title: "Expert Doctors",
    description: "Find experienced doctors across all specializations and book appointments instantly."
  },
  {
    icon: <Beaker className="w-10 h-10 text-primary" />,
    title: "Lab Tests",
    description: "Schedule a wide range of lab tests from the comfort of your home with ease."
  },
  {
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    title: "AI Recommendations",
    description: "Get smart suggestions for doctors and tests based on your symptoms."
  },
   {
    icon: <UserCheck className="w-10 h-10 text-primary" />,
    title: "Personalized Profile",
    description: "Manage your appointments, view your history, and keep track of your health."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
            A Better Way to Manage Your Health
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            HealthConnect simplifies your healthcare journey, from finding a doctor to getting lab results.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                 {feature.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl font-headline mb-2">{feature.title}</CardTitle>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
