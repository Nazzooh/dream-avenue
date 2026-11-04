import { Building2, Trees, Sunset, UtensilsCrossed, Car, Music, Wind, Utensils, Sparkles } from 'lucide-react';

export interface CuratedSpace {
  id: string;
  title: string;
  category: string;
  capacity: string;
  subtitles?: string;
  description: string;
  image?: string;
  icon: string;
}

export const CURATED_SPACES: CuratedSpace[] = [
  {
    id: 'space-1',
    title: 'The Grand Event Hall',
    category: 'Main Auditorium',
    capacity: '1,000+ Guests',
    subtitles: '800+ Guests, Acoustic Staging, Ambient Chandeliers',
    description: 'High-volume hall with expansive sightlines, state-of-the-art acoustic staging, and ambient chandeliers designed for memorable wedding receptions and assemblies.',
    image: '/new-gallery-images/banquet-hall.png',
    icon: 'banquet',
  },
  {
    id: 'space-2',
    title: 'Banquet Dining Hall',
    category: 'Dining Experience',
    capacity: '500+ Seated',
    subtitles: '500+ Seated, Air Conditioned, Buffet Corridors',
    description: 'Fully air-conditioned dining area with wide buffet corridors and ergonomic seating, ensuring a smooth, pleasant culinary experience for all your attendees.',
    image: '/new-gallery-images/dining.png',
    icon: 'dining',
  },
  {
    id: 'space-3',
    title: 'Scenic Open-Air Lawn',
    category: 'Outdoor Ambience',
    capacity: '350+ Guests',
    subtitles: '350+ Guests, Festoon Lights, Golden-Hour Lawn',
    description: 'Landscaped green lawns framed with ambient festoon lighting, ideal for open-air welcomes, golden-hour photography, and evening cocktail sessions.',
    image: '/new-gallery-images/outdoor.png',
    icon: 'garden',
  },
  {
    id: 'space-4',
    title: 'Executive Bridal & Groom Suites',
    category: 'Private Sanctuaries',
    capacity: 'Private',
    subtitles: 'Private Suite, Vanity Mirrors, Lounge Seating',
    description: 'Quiet, air-conditioned private suites equipped with full-length vanity mirrors, private restrooms, and plush lounge seating for touch-ups and rest.',
    image: '/new-gallery-images/corporate-event.png',
    icon: 'ac',
  },
  {
    id: 'space-5',
    title: 'Commercial Food Prep Area',
    category: 'Catering Support',
    capacity: 'Full Service',
    subtitles: 'Full Service, Staging Kitchen, Service Access',
    description: 'Clean, dedicated staging kitchen and pantry area enabling your chosen external caterers to plate and serve warm dishes seamlessly.',
    icon: 'catering',
  },
  {
    id: 'space-6',
    title: 'Secure Parking Plaza',
    category: 'Guest Convenience',
    capacity: '100+ Vehicles',
    subtitles: '100+ Vehicles, Valet Drop-off, 24/7 Security',
    description: 'Spacious on-site parking plaza with clear driveway ingress/egress, security personnel, and organized valet drop-off facilities.',
    icon: 'parking',
  },
];

const iconMap: Record<string, any> = {
  banquet: Building2,
  garden: Trees,
  terrace: Sunset,
  catering: UtensilsCrossed,
  parking: Car,
  music: Music,
  ac: Wind,
  dining: Utensils,
};

export const getFacilityIcon = (iconName?: string) => {
  if (!iconName) return Sparkles;
  return iconMap[iconName.toLowerCase()] || Sparkles;
};
