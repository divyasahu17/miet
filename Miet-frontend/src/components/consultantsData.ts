export type Consultant = {
  id: number;
  name: string;
  image: string;
  expertise: string;
  city: string;
  mode: string;
  tagline: string;
  highlights: string;
  address: string;
  phone: string;
  email: string;
  location: string;
  bio: string;
};

export const consultants: Consultant[] = [
  {
    id: 1,
    name: 'Dr. Asha Mehta',
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Child Psychologist',
    city: 'Delhi',
    mode: 'Online',
    tagline: 'Empowering children and families with compassion and expertise.',
    highlights: '15+ years experience · Award-winning speaker · Author',
    address: '123 Main St, Delhi, 110001',
    phone: '+91 9876543210',
    email: 'asha.mehta@example.com',
    location: '28.6139,77.2090',
    bio: 'Dr. Asha Mehta is a renowned child psychologist with over 15 years of experience helping children and families thrive.'
  },
  {
    id: 2,
    name: 'Mr. Rajiv Kumar',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Speech Therapist',
    city: 'Noida',
    mode: 'At Home',
    tagline: 'Unlocking communication, one word at a time.',
    highlights: '10+ years · Multilingual · Parent favorite',
    address: '456 Family Lane, Noida, 201301',
    phone: '+91 9123456780',
    email: 'rajiv.kumar@example.com',
    location: '28.5355,77.3910',
    bio: 'Mr. Rajiv Kumar is a skilled speech therapist with over 10 years of experience helping individuals overcome communication challenges.'
  },
  {
    id: 3,
    name: 'Ms. Priya Singh',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Special Educator',
    city: 'Gurgaon',
    mode: 'Online',
    tagline: 'Inclusive learning for every child.',
    highlights: '8+ years · Certified SEN · Creative teaching',
    address: '567 Education Ave, Gurgaon, 122001',
    phone: '+91 9234567890',
    email: 'priya.singh@example.com',
    location: '28.4467,77.0266',
    bio: 'Ms. Priya Singh is a dedicated special educator with over 8 years of experience supporting children with special needs.'
  },
  {
    id: 4,
    name: 'Dr. Neha Sharma',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Clinical Psychologist',
    city: 'Delhi',
    mode: 'At Home',
    tagline: 'Mental wellness, made accessible.',
    highlights: '12+ years · CBT specialist · Empathy-driven',
    address: '789 Wellness Way, Delhi, 110003',
    phone: '+91 9345678901',
    email: 'neha.sharma@example.com',
    location: '28.5678,77.2345',
    bio: 'Dr. Neha Sharma is a compassionate clinical psychologist with over 12 years of experience helping individuals navigate mental health challenges.'
  },
  {
    id: 5,
    name: 'Mr. Anil Kapoor',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Occupational Therapist',
    city: 'Gurgaon',
    mode: 'Online',
    tagline: 'Building skills for independent living.',
    highlights: '9+ years · Sensory integration · Fun sessions',
    address: '567 Education Ave, Gurgaon, 122001',
    phone: '+91 9456789012',
    email: 'anil.kapoor@example.com',
    location: '28.4467,77.0266',
    bio: 'Mr. Anil Kapoor is an experienced occupational therapist with over 9 years of experience helping individuals develop skills for independent living.'
  },
  {
    id: 6,
    name: 'Dr. Suresh Gupta',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Neurodevelopmental Specialist',
    city: 'Delhi',
    mode: 'Online',
    tagline: 'Transforming lives through neurodiversity.',
    highlights: '20+ years · Researcher · Speaker',
    address: '789 Innovation Park, Delhi, 110003',
    phone: '+91 9988776655',
    email: 'suresh.gupta@example.com',
    location: '28.5678,77.2345',
    bio: 'Dr. Suresh Gupta is a leading expert in neurodevelopmental disorders and inclusive education.'
  },
  {
    id: 7,
    name: 'Ms. Ritu Verma',
    image: 'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Parent Support Specialist',
    city: 'Noida',
    mode: 'At Home',
    tagline: 'Supporting parents, empowering children.',
    highlights: '12+ years · Parent coach · Workshop leader',
    address: '456 Family Lane, Noida, 201301',
    phone: '+91 9123456780',
    email: 'ritu.verma@example.com',
    location: '28.5355,77.3910',
    bio: 'Ms. Ritu Verma specializes in parent support and advocacy for children with special needs.'
  }
]; 