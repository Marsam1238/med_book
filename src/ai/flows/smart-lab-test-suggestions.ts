// src/ai/flows/smart-lab-test-suggestions.ts
'use server';

/**
 * @fileOverview Provides AI-driven suggestions for lab tests based on user inputs.
 *
 * - getSmartLabTestSuggestions - A function that suggests relevant lab tests based on symptoms and search history.
 * - SmartLabTestSuggestionsInput - The input type for the getSmartLabTestSuggestions function.
 * - SmartLabTestSuggestionsOutput - The return type for the getSmartLabTestSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartLabTestSuggestionsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms the user is experiencing.'),
  searchHistory: z
    .string()
    .describe('The user recent search history.'),
});
export type SmartLabTestSuggestionsInput = z.infer<
  typeof SmartLabTestSuggestionsInputSchema
>;

const SmartLabTestSuggestionsOutputSchema = z.object({
  suggestedTests: z
    .array(z.string())
    .describe('An array of suggested lab tests based on the input.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the suggested tests.'),
});
export type SmartLabTestSuggestionsOutput = z.infer<
  typeof SmartLabTestSuggestionsOutputSchema
>;

export async function getSmartLabTestSuggestions(
  input: SmartLabTestSuggestionsInput
): Promise<SmartLabTestSuggestionsOutput> {
  return smartLabTestSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartLabTestSuggestionsPrompt',
  input: {schema: SmartLabTestSuggestionsInputSchema},
  output: {schema: SmartLabTestSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to suggest relevant lab tests based on a user's symptoms and search history.

  Symptoms: {{{symptoms}}}
  Search History: {{{searchHistory}}}

  Based on the symptoms and search history, suggest a few relevant lab tests that the user should consider. Explain your reasoning behind each suggestion.

  Format your response as a JSON object with 'suggestedTests' and 'reasoning' fields.
  `,
});

const smartLabTestSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartLabTestSuggestionsFlow',
    inputSchema: SmartLabTestSuggestionsInputSchema,
    outputSchema: SmartLabTestSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
