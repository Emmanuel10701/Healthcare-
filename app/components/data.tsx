// data/doctors.ts

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    degree: string;
    description: string;
    image: string;
  }
  
  export const doctorsData: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Smith',
      specialty: 'Dentist 🦷',
      degree: 'DDS (Doctor of Dental Surgery)',
      description: 'Dr. Smith has over 10 years of experience in providing dental care and is committed to ensuring the best outcomes for his patients.',
      image: '/assets/assets_frontend/doc1.png',
    },
    {
      id: 2,
      name: 'Dr. Johnson',
      specialty: 'Dentist 🦷',
      degree: 'DMD (Doctor of Medicine in Dentistry)',
      description: 'Dr. Johnson focuses on restorative dentistry and has a passion for patient care.',
      image: '/assets/assets_frontend/doc2.png',
    },
    {
      id: 3,
      name: 'Dr. Lee',
      specialty: 'Dentist 🦷',
      degree: 'BDS (Bachelor of Dental Surgery)',
      description: 'Dr. Lee is known for her expertise in pediatric dentistry and making kids feel comfortable during their visits.',
      image: '/assets/assets_frontend/doc3.png',
    },
    {
      id: 4,
      name: 'Dr. Brown',
      specialty: 'Orthodontist 😁',
      degree: 'MS (Master of Science) in Orthodontics',
      description: 'Dr. Brown specializes in braces and aligners, helping patients achieve their dream smiles.',
      image: '/assets/assets_frontend/doc4.png',
    },
    {
      id: 5,
      name: 'Dr. Garcia',
      specialty: 'Oral Surgeon 🦷',
      degree: 'DDS (Doctor of Dental Surgery)',
      description: 'Dr. Garcia performs various surgical procedures, including wisdom tooth extractions and dental implants.',
      image: '/assets/assets_frontend/doc5.png',
    },
    {
      id: 6,
      name: 'Dr. Wilson',
      specialty: 'General Physician 👨‍⚕️',
      degree: 'MD (Doctor of Medicine)',
      description: 'Dr. Wilson has extensive experience in family medicine and preventive care.',
      image: '/assets/assets_frontend/doc6.png',
    },
    {
      id: 7,
      name: 'Dr. Martinez',
      specialty: 'Dermatologist 🧴',
      degree: 'MD (Doctor of Medicine)',
      description: 'Dr. Martinez specializes in treating skin conditions and cosmetic procedures.',
      image: '/assets/assets_frontend/doc7.png',
    },
    {
      id: 8,
      name: 'Dr. Taylor',
      specialty: 'Pediatrician 👶',
      degree: 'MD (Doctor of Medicine)',
      description: 'Dr. Taylor is dedicated to the health and well-being of children from infancy through adolescence.',
      image: '/assets/assets_frontend/doc8.png',
    },
    {
      id: 9,
      name: 'Dr. Anderson',
      specialty: 'Gastroenterologist 🍽️',
      degree: 'MD (Doctor of Medicine)',
      description: 'Dr. Anderson specializes in digestive system disorders and offers advanced treatment options.',
      image: '/assets/assets_frontend/doc9.png',
    },
    {
      id: 10,
      name: 'Dr. Thomas',
      specialty: 'Neurologist 🧠',
      degree: 'MD (Doctor of Medicine)',
      description: 'Dr. Thomas focuses on treating neurological conditions and improving patients’ quality of life.',
      image: '/assets/assets_frontend/doc10.png',
    },
    {
      id: 11,
      name: 'Dr. Moore',
      specialty: 'Gynecologist 👩‍⚕️',
      degree: 'MD (Doctor of Medicine)',
      description: 'Dr. Moore is committed to women’s health and provides comprehensive gynecological care.',
      image: '/assets/assets_frontend/doc11.png',
    },
    {
      id: 12,
      name: 'Dr. Harris',
      specialty: 'Cardiologist ❤️',
      degree: 'MD (Doctor of Medicine)',
      description: 'Dr. Harris specializes in heart health and offers preventive care and advanced treatments.',
      image: '/assets/assets_frontend/doc12.png',
    },
    {
      id: 13,
      name: 'Dr. Clark',
      specialty: 'Endocrinologist 🔬',
      degree: 'MD (Doctor of Medicine)',
      description: 'Dr. Clark focuses on hormone-related disorders and metabolic conditions.',
      image: '/assets/assets_frontend/doc13.png',
    },
    {
      id: 14,
      name: 'Dr. Lewis',
      specialty: 'Orthopedic Surgeon 🦴',
      degree: 'MD (Doctor of Medicine)',
      description: 'Dr. Lewis specializes in musculoskeletal disorders and joint replacements.',
      image: '/assets/assets_frontend/doc14.png',
    },
    {
      id: 15,
      name: 'Dr. Robinson',
      specialty: 'Psychiatrist 🧠',
      degree: 'MD (Doctor of Medicine)',
      description: 'Dr. Robinson is dedicated to mental health and provides compassionate care for psychological disorders.',
      image: '/assets/assets_frontend/doc15.png',
    },
  ];
  