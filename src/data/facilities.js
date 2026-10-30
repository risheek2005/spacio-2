/**
 * Central mock data source for Spacio.
 * All facility information lives here. Components only consume the shape
 * defined below, making it easy to swap in a real API later.
 *
 * status: 'Open' | 'Busy' | 'Closed'
 * crowd:  'Low' | 'Moderate' | 'High'
 * category: 'Gym' | 'Library' | 'Study Room' | 'Labs' | 'Auditorium' | 'Other'
 */

export const FACILITIES = [
  {
    id: 'gym',
    name: 'Gym',
    category: 'Gym',
    location: 'Sports Complex, Block B',
    status: 'Open',
    crowd: 'Low',
    occupancy: 32,
    capacity: 120,
    hours: '6:00 AM – 9:00 PM',
    image: '/gym.jpg',
    amenities: ['Weights', 'Cardio', 'Lockers', 'Showers', 'Water Station'],
    amenityIcons: { Weights: 'Dumbbell', Cardio: 'Activity', Lockers: 'Lock', Showers: 'Droplets', 'Water Station': 'Droplet' },
    blurb: 'Room to move — low crowd right now.',
    about: 'The campus gym is a state-of-the-art facility with modern equipment for cardio and strength training. Enjoy panoramic windows, high ceilings, and a welcoming atmosphere for all fitness levels.',
    mapPosition: { x: 28, y: 55 },
  },
  {
    id: 'library',
    name: 'Library',
    category: 'Library',
    location: 'Academic Block A',
    status: 'Open',
    crowd: 'Moderate',
    occupancy: 58,
    capacity: 300,
    hours: '8:00 AM – 10:00 PM',
    image: '/library.jpg',
    amenities: ['Wi-Fi', 'AC', 'Charging', 'Study Tables', 'Silent Zone'],
    amenityIcons: { 'Wi-Fi': 'Wifi', AC: 'Wind', Charging: 'BatteryCharging', 'Study Tables': 'BookOpen', 'Silent Zone': 'VolumeX' },
    blurb: 'Moderately busy — some quiet spots available.',
    about: 'The Central Library houses over 50,000 volumes and offers dedicated silent study zones, group discussion rooms, and high-speed internet throughout. Open to all students during semester.',
    mapPosition: { x: 55, y: 35 },
  },
  {
    id: 'study-room-a',
    name: 'Study Room A',
    category: 'Study Room',
    location: 'Learning Hub, Floor 2',
    status: 'Open',
    crowd: 'Low',
    occupancy: 25,
    capacity: 20,
    hours: '7:00 AM – 11:00 PM',
    image: '/study_room.jpg',
    amenities: ['Wi-Fi', 'Whiteboard', 'Projector', 'AC', 'Charging'],
    amenityIcons: { 'Wi-Fi': 'Wifi', Whiteboard: 'PenLine', Projector: 'MonitorPlay', AC: 'Wind', Charging: 'BatteryCharging' },
    blurb: 'Quiet and available — great time to book.',
    about: 'Study Room A is a dedicated collaborative space with a large whiteboard, integrated projector, and flexible furniture. Ideal for group sessions and presentations.',
    mapPosition: { x: 70, y: 48 },
  },
  {
    id: 'labs',
    name: 'Computer Labs',
    category: 'Labs',
    location: 'Tech Building, Ground Floor',
    status: 'Busy',
    crowd: 'High',
    occupancy: 82,
    capacity: 60,
    hours: '8:00 AM – 8:00 PM',
    image: '/study_room.jpg',
    amenities: ['High-Speed PCs', 'Wi-Fi', 'Printing', 'AC', 'Charging'],
    amenityIcons: { 'High-Speed PCs': 'Monitor', 'Wi-Fi': 'Wifi', Printing: 'Printer', AC: 'Wind', Charging: 'BatteryCharging' },
    blurb: 'Very busy — consider coming back later.',
    about: 'The Computer Labs provide 60 high-performance workstations with the latest software for academic and creative work. Printing facilities are available at the help desk.',
    mapPosition: { x: 42, y: 62 },
  },
  {
    id: 'auditorium',
    name: 'Auditorium',
    category: 'Auditorium',
    location: 'Main Campus, Central Hall',
    status: 'Open',
    crowd: 'Low',
    occupancy: 15,
    capacity: 500,
    hours: '9:00 AM – 9:00 PM',
    image: '/auditorium.jpg',
    amenities: ['Stage', 'Sound System', 'Projector', 'AC', 'Accessible Seating'],
    amenityIcons: { Stage: 'Theater', 'Sound System': 'Volume2', Projector: 'MonitorPlay', AC: 'Wind', 'Accessible Seating': 'Accessibility' },
    blurb: 'Mostly open — perfect for events.',
    about: 'The Main Auditorium seats up to 500 guests with professional acoustics, a full stage, and state-of-the-art AV equipment. Bookable for lectures, performances, and campus events.',
    mapPosition: { x: 62, y: 65 },
  },
  {
    id: 'study-room-b',
    name: 'Study Room B',
    category: 'Study Room',
    location: 'Learning Hub, Floor 3',
    status: 'Busy',
    crowd: 'Moderate',
    occupancy: 70,
    capacity: 15,
    hours: '7:00 AM – 11:00 PM',
    image: '/study_room.jpg',
    amenities: ['Wi-Fi', 'Whiteboard', 'AC', 'Charging'],
    amenityIcons: { 'Wi-Fi': 'Wifi', Whiteboard: 'PenLine', AC: 'Wind', Charging: 'BatteryCharging' },
    blurb: 'Getting busy — a few spots left.',
    about: 'Study Room B is a compact, quieter alternative on the third floor of the Learning Hub. Equipped with a whiteboard and projector for smaller study groups.',
    mapPosition: { x: 75, y: 55 },
  },
];

export function getFacilityById(id) {
  return FACILITIES.find((f) => f.id === id);
}

export function getFacilitiesByCategory(category) {
  if (!category || category === 'All') return FACILITIES;
  return FACILITIES.filter((f) => f.category === category);
}

export function searchFacilities(query) {
  const q = query.trim().toLowerCase();
  if (!q) return FACILITIES;
  return FACILITIES.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
  );
}

export const CATEGORIES = ['Gym', 'Library', 'Study Room', 'Labs', 'Auditorium', 'Other'];

export function getCampusSummary() {
  return FACILITIES.reduce(
    (acc, f) => {
      if (f.status === 'Open') acc.open += 1;
      else if (f.status === 'Busy') acc.busy += 1;
      else acc.closed += 1;
      return acc;
    },
    { open: 0, busy: 0, closed: 0 }
  );
}
