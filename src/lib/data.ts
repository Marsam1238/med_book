export const doctorSpecializations = [
  'All',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedic',
  'Gynecologist',
  'Pediatrician',
  'Ophthalmologist',
  'Dentist',
];

export const labTestCategories = [
  'All',
  'Blood Tests',
  'Urine Tests',
  'Imaging',
  'Heart Tests',
  'COVID/Viral',
  'Hormone Tests',
];

export const doctors = [
  {
    id: 1,
    name: 'Dr. Emily Carter',
    specialization: 'Cardiologist',
    experience: '15 years',
    image: 'doctor-1',
  },
  {
    id: 2,
    name: 'Dr. Ben Adams',
    specialization: 'Dermatologist',
    experience: '12 years',
    image: 'doctor-2',
  },
  {
    id: 3,
    name: 'Dr. Sarah Jenkins',
    specialization: 'Neurologist',
    experience: '20 years',
    image: 'doctor-3',
  },
  {
    id: 4,
    name: 'Dr. Michael Lee',
    specialization: 'Orthopedic',
    experience: '18 years',
    image: 'doctor-5',
  },
  {
    id: 5,
    name: 'Dr. Olivia White',
    specialization: 'Gynecologist',
    experience: '10 years',
    image: 'doctor-4',
  },
  {
    id: 6,
    name: 'Dr. David Green',
    specialization: 'Pediatrician',
    experience: '25 years',
    image: 'doctor-7',
  },
  {
    id: 7,
    name: 'Dr. Laura Martinez',
    specialization: 'Ophthalmologist',
    experience: '14 years',
    image: 'doctor-6',
  },
  {
    id: 8,
    name: 'Dr. Robert Brown',
    specialization: 'Dentist',
    experience: '9 years',
    image: 'doctor-8',
  },
];

export const labTests = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    category: 'Blood Tests',
    image: 'lab-test-1',
  },
  {
    id: 2,
    name: 'Urinalysis',
    category: 'Urine Tests',
    image: 'lab-test-2',
  },
  {
    id: 3,
    name: 'Magnetic Resonance Imaging (MRI)',
    category: 'Imaging',
    image: 'lab-test-3',
  },
  {
    id: 4,
    name: 'Electrocardiogram (ECG)',
    category: 'Heart Tests',
    image: 'lab-test-4',
  },
  {
    id: 5,
    name: 'COVID-19 RT-PCR Test',
    category: 'COVID/Viral',
    image: 'lab-test-5',
  },
  {
    id: 6,
    name: 'Thyroid Function Test',
    category: 'Hormone Tests',
    image: 'lab-test-6',
  },
];

export type Doctor = (typeof doctors)[0];
export type LabTest = (typeof labTests)[0];
