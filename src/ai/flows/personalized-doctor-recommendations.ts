// src/ai/flows/personalized-doctor-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized doctor recommendations based on user-provided symptoms and medical history.
 *
 * - personalizedDoctorRecommendations - A function that accepts user symptoms and medical history
 *   and returns a list of recommended doctors with their specializations.
 * - PersonalizedDoctorRecommendationsInput - The input type for the personalizedDoctorRecommendations function.
 * - PersonalizedDoctorRecommendationsOutput - The return type for the personalizedDoctorRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedDoctorRecommendationsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms the user is experiencing.'),
  medicalHistory: z
    .string()
    .describe('The user medical history.'),
});
export type PersonalizedDoctorRecommendationsInput = z.infer<typeof PersonalizedDoctorRecommendationsInputSchema>;

const PersonalizedDoctorRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      doctorName: z.string().describe('The name of the recommended doctor.'),
      specialization: z.string().describe('The specialization of the doctor.'),
      rationale: z.string().describe('Why this doctor is a good fit for the user given their symptoms and history')
    })
  ).describe('A list of recommended doctors and their specializations.'),
});
export type PersonalizedDoctorRecommendationsOutput = z.infer<typeof PersonalizedDoctorRecommendationsOutputSchema>;

export async function personalizedDoctorRecommendations(input: PersonalizedDoctorRecommendationsInput): Promise<PersonalizedDoctorRecommendationsOutput> {
  return personalizedDoctorRecommendationsFlow(input);
}

const personalizedDoctorRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedDoctorRecommendationsPrompt',
  input: {schema: PersonalizedDoctorRecommendationsInputSchema},
  output: {schema: PersonalizedDoctorRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized doctor recommendations.

  Based on the user's reported symptoms and medical history, recommend doctors with the most relevant specializations.
  Explain your rationale for each recommendation.

  Symptoms: {{{symptoms}}}
  Medical History: {{{medicalHistory}}}

  Ensure the recommendations are clear and actionable for the user.

  Format your response as a JSON object that adheres to the following schema:
  ${JSON.stringify(PersonalizedDoctorRecommendationsOutputSchema.describe)}
  `,
});

const personalizedDoctorRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedDoctorRecommendationsFlow',
    inputSchema: PersonalizedDoctorRecommendationsInputSchema,
    outputSchema: PersonalizedDoctorRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedDoctorRecommendationsPrompt(input);
    return output!;
  }
);
