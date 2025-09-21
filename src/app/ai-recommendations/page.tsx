'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Stethoscope, Beaker, Lightbulb } from 'lucide-react';
import {
  PersonalizedDoctorRecommendationsOutput,
  personalizedDoctorRecommendations,
} from '@/ai/flows/personalized-doctor-recommendations';
import {
  SmartLabTestSuggestionsOutput,
  getSmartLabTestSuggestions,
} from '@/ai/flows/smart-lab-test-suggestions';

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please describe your symptoms in at least 10 characters.',
  }),
  medicalHistory: z.string().optional(),
});

type AiOutput = {
  doctors: PersonalizedDoctorRecommendationsOutput | null;
  labTests: SmartLabTestSuggestionsOutput | null;
};

export default function AiRecommendationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
      medicalHistory: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAiResult(null);
    setError(null);

    try {
      const [doctorRes, labTestRes] = await Promise.all([
        personalizedDoctorRecommendations({
          symptoms: values.symptoms,
          medicalHistory: values.medicalHistory || 'No relevant medical history provided.',
        }),
        getSmartLabTestSuggestions({
          symptoms: values.symptoms,
          searchHistory: 'doctor booking, lab tests, common cold symptoms', // Mock search history
        }),
      ]);

      setAiResult({
        doctors: doctorRes,
        labTests: labTestRes,
      });
    } catch (e) {
      console.error(e);
      setError('An error occurred while fetching recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <Sparkles className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          AI-Powered Recommendations
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Describe your symptoms and let our smart assistant suggest relevant doctors and lab tests for you.
        </p>
      </div>

      <Card className="mx-auto mt-10 max-w-3xl">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., persistent cough, headache, and a slight fever for the last 3 days..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The more detail you provide, the better the recommendations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Medical History (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., history of asthma, allergic to penicillin..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide any relevant past conditions, allergies, or surgeries.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <p className="mt-6 text-center text-destructive">{error}</p>
      )}

      {aiResult && (
        <div className="mt-12 mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Stethoscope className="text-primary" /> Recommended Doctors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiResult.doctors?.recommendations?.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg bg-secondary/30">
                  <h4 className="font-semibold">{rec.doctorName} - <span className="font-normal">{rec.specialization}</span></h4>
                  <p className="mt-2 text-sm text-muted-foreground">{rec.rationale}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Beaker className="text-primary" /> Suggested Lab Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-secondary/30">
                <ul className="list-disc list-inside space-y-1">
                  {aiResult.labTests?.suggestedTests?.map((test, index) => (
                    <li key={index} className="font-semibold">{test}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" /> Reasoning</h4>
                <p className="mt-2 text-sm text-muted-foreground">{aiResult.labTests?.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
