export interface PolicyRule { id?: string; title: string; body: string; position: number; archived?: boolean }
export interface PolicySection { id?: string; title: string; slug: string; position: number; rules: PolicyRule[] }

// This is the approved scan transcription used only until the database is available.
// The first migration seeds this exact content as the live policy version.
export const INITIAL_POLICY_SECTIONS: PolicySection[] = [
  { title: 'Payment and booking', slug: 'payment-booking', position: 1, rules: [
    { title: 'Payment obligations', body: 'The remaining rent and a security deposit of ₹25,000 must be paid at the auditorium one day before the event. The kitchen will only be accessible once full payment is received and a receipt is issued.', position: 1 },
    { title: 'Non-refundable advance', body: 'Any advance payments made are non-refundable.', position: 2 },
    { title: 'Booking party responsibility', body: 'The responsibility for the event lies solely with the booking party. Guests are not covered under the booking agreement.', position: 3 },
  ]},
  { title: 'Security and liability', slug: 'security-liability', position: 2, rules: [
    { title: 'Personal belongings', body: 'Keep valuables such as gold, cash, and mobiles with you. The hall is not liable for any loss.', position: 1 },
    { title: 'Plastic usage', body: 'Plastic glasses and plates are prohibited. Bookings using such items will not be accepted.', position: 2 },
    { title: 'Security arrangements', body: 'One security guard is provided by the hall. If vehicles overflow onto the road, the booking party must arrange additional security to prevent blockage.', position: 3 },
    { title: 'Power supply', body: 'If extra fans or lights are required, a generator must be brought in by the booking party.', position: 4 },
    { title: 'Accommodation', body: 'No accommodation is provided within the hall premises.', position: 5 },
  ]},
  { title: 'Facilities and usage', slug: 'facilities-usage', position: 3, rules: [
    { title: 'Utensils usage', body: 'Only utensils provided by the auditorium may be used. Bringing outside utensils is not allowed.', position: 1 },
    { title: 'Stage programs', body: 'Stage programs with sound are permitted only until 10 pm.', position: 2 },
    { title: 'Kitchen access', body: 'If the hall is not booked for the previous day, only the kitchen and items for preparing food will be accessible.', position: 3 },
    { title: 'Hall access for weddings', body: 'For daytime weddings, the hall is accessible from 9 am to 4 pm and 6 pm to 10 pm.', position: 4 },
  ]},
  { title: 'Property and damage', slug: 'property-damage', position: 4, rules: [
    { title: 'Property damage', body: 'Any damage to property within the auditorium will be charged to the booking party.', position: 1 },
    { title: 'Vehicle liability', body: 'The hall is not responsible for vehicles parked in the hall compound.', position: 2 },
  ]},
  { title: 'Catering and food', slug: 'catering-food', position: 5, rules: [
    { title: 'Food responsibility', body: 'The booking party is fully responsible for the food served at the event.', position: 1 },
    { title: 'Caterer dealings', body: 'The hall will not engage with the caterer appointed by the booking party.', position: 2 },
    { title: 'Video charge', body: 'A current charge of ₹500 is applicable for using the video facilities.', position: 3 },
    { title: 'Food restrictions', body: 'Do not use food items in the function hall.', position: 4 },
    { title: 'Firecracker prohibition', body: 'The bursting of firecrackers is strictly prohibited within the hall compound.', position: 5 },
    { title: 'Dining hall capacity', body: 'The dining hall can accommodate only 100 people at a time for dining.', position: 6 },
  ]},
  { title: 'Music and parking', slug: 'music-parking', position: 6, rules: [
    { title: 'Music festivals', body: 'Organizers must bring a generator for music festivals. The festival can only be held until 10 pm.', position: 1 },
    { title: 'Parking facilities', body: 'The auditorium compound has parking space for 30 cars; an additional parking space for 50 cars is available on the grounds outside the auditorium.', position: 2 },
  ]},
  { title: 'Health and safety', slug: 'health-safety', position: 7, rules: [
    { title: 'Catering requirements', body: 'The catering personnel must have a food license, and the cooking staff must possess a health card.', position: 1 },
    { title: 'Food disposal', body: 'Leftover food items must be disposed of at the booking party’s own risk.', position: 2 },
  ]},
];
