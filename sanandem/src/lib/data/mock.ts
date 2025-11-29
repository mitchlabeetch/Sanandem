export const mockMedicationReports = [
    { id: 1, medicationName: 'Aspirin', sideEffect: 'Nausea', severity: 3, age: 45, gender: 'female', createdAt: '2023-10-01' },
    { id: 2, medicationName: 'Ibuprofen', sideEffect: 'Stomach Pain', severity: 5, age: 30, gender: 'male', createdAt: '2023-10-02' },
    { id: 3, medicationName: 'Amoxicillin', sideEffect: 'Rash', severity: 6, age: 25, gender: 'female', createdAt: '2023-10-05' },
    { id: 4, medicationName: 'Lisinopril', sideEffect: 'Cough', severity: 4, age: 60, gender: 'male', createdAt: '2023-10-06' },
    { id: 5, medicationName: 'Metformin', sideEffect: 'Diarrhea', severity: 4, age: 55, gender: 'female', createdAt: '2023-10-07' },
    { id: 6, medicationName: 'Aspirin', sideEffect: 'Dizziness', severity: 2, age: 48, gender: 'male', createdAt: '2023-10-08' },
    { id: 7, medicationName: 'Ibuprofen', sideEffect: 'Headache', severity: 2, age: 32, gender: 'female', createdAt: '2023-10-09' },
    { id: 8, medicationName: 'Atorvastatin', sideEffect: 'Muscle Pain', severity: 7, age: 65, gender: 'male', createdAt: '2023-10-10' },
    { id: 9, medicationName: 'Levothyroxine', sideEffect: 'Palpitations', severity: 5, age: 40, gender: 'female', createdAt: '2023-10-11' },
    { id: 10, medicationName: 'Amlodipine', sideEffect: 'Swelling', severity: 3, age: 70, gender: 'male', createdAt: '2023-10-12' },
    { id: 11, medicationName: 'Metformin', sideEffect: 'Nausea', severity: 3, age: 52, gender: 'male', createdAt: '2023-10-13' },
    { id: 12, medicationName: 'Omeprazole', sideEffect: 'Headache', severity: 2, age: 38, gender: 'female', createdAt: '2023-10-14' },
    { id: 13, medicationName: 'Losartan', sideEffect: 'Dizziness', severity: 3, age: 58, gender: 'male', createdAt: '2023-10-15' },
    { id: 14, medicationName: 'Gabapentin', sideEffect: 'Drowsiness', severity: 6, age: 42, gender: 'female', createdAt: '2023-10-16' },
    { id: 15, medicationName: 'Hydrochlorothiazide', sideEffect: 'Frequent Urination', severity: 4, age: 62, gender: 'male', createdAt: '2023-10-17' },
    { id: 16, medicationName: 'Sertraline', sideEffect: 'Insomnia', severity: 5, age: 28, gender: 'female', createdAt: '2023-10-18' },
    { id: 17, medicationName: 'Simvastatin', sideEffect: 'Muscle Pain', severity: 6, age: 67, gender: 'male', createdAt: '2023-10-19' },
    { id: 18, medicationName: 'Metoprolol', sideEffect: 'Fatigue', severity: 4, age: 50, gender: 'female', createdAt: '2023-10-20' },
    { id: 19, medicationName: 'Pantoprazole', sideEffect: 'Stomach Pain', severity: 3, age: 45, gender: 'male', createdAt: '2023-10-21' },
    { id: 20, medicationName: 'Prednisone', sideEffect: 'Weight Gain', severity: 7, age: 35, gender: 'female', createdAt: '2023-10-22' },
];

export const sideEffectStats = [
    { name: 'Nausea', value: 150 },
    { name: 'Headache', value: 120 },
    { name: 'Dizziness', value: 90 },
    { name: 'Fatigue', value: 80 },
    { name: 'Rash', value: 60 },
    { name: 'Muscle Pain', value: 50 },
    { name: 'Insomnia', value: 40 },
    { name: 'Cough', value: 30 },
];

export const severityByMed = [
    { name: 'Aspirin', value: 2.5 },
    { name: 'Ibuprofen', value: 3.1 },
    { name: 'Atorvastatin', value: 5.2 },
    { name: 'Metformin', value: 3.8 },
    { name: 'Lisinopril', value: 4.0 },
    { name: 'Amoxicillin', value: 5.5 },
];

export const graphData = {
    nodes: [
        { id: 'Aspirin', group: 1, radius: 20 },
        { id: 'Ibuprofen', group: 1, radius: 15 },
        { id: 'Nausea', group: 2, radius: 10 },
        { id: 'Headache', group: 2, radius: 12 },
        { id: 'Stomach Pain', group: 2, radius: 8 },
        { id: 'Dizziness', group: 2, radius: 9 },
        { id: 'Male', group: 3, radius: 25 },
        { id: 'Female', group: 3, radius: 25 },
    ],
    links: [
        { source: 'Aspirin', target: 'Nausea', value: 5 },
        { source: 'Aspirin', target: 'Headache', value: 3 },
        { source: 'Aspirin', target: 'Dizziness', value: 2 },
        { source: 'Ibuprofen', target: 'Stomach Pain', value: 4 },
        { source: 'Ibuprofen', target: 'Headache', value: 2 },
        { source: 'Male', target: 'Aspirin', value: 10 },
        { source: 'Female', target: 'Aspirin', value: 8 },
        { source: 'Male', target: 'Ibuprofen', value: 5 },
        { source: 'Female', target: 'Ibuprofen', value: 7 },
    ]
};
