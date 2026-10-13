/**
 * Central mock data source for Spacio.
 *
 * This is the ONE place facility information lives. Both the Dashboard
 * cards and the FacilityDetails page read from this file, so updating a
 * facility's status, occupancy, or amenities here updates the whole app.
 *
 * In a future version, this module could be swapped for a real API call
 * (e.g. `fetch('/api/facilities')`) without changing any component code,
 * since components only ever consume the shape defined below.
 *
 * status: 'Open' | 'Busy' | 'Closed'
 * crowd:  'Low' | 'Moderate' | 'High'   (drives the Weber's-law status tone)
 */

export const FACILITIES = [
  {
    id: 'library',
    name: 'Central Library',
    location: 'Block A',
    status: 'Open',
    crowd: 'Moderate',
    occupancy: 58,
    hours: '8:00 AM – 8:00 PM',
    amenities: ['Wi-Fi', 'AC', 'Charging', 'Study Tables'],
    blurb: 'Moderately busy',
  },
  {
    id: 'gym',
    name: 'Gym',
    location: 'Block B',
    status: 'Open',
    crowd: 'Low',
    occupancy: 32,
    hours: '6:00 AM – 9:00 PM',
    amenities: ['Equipment', 'Changing Room', 'Water Station'],
    blurb: 'Low crowd',
  },
];

export function getFacilityById(id) {
  return FACILITIES.find((f) => f.id === id);
}

/** Small derived summary used by the "Campus right now" strip on the Dashboard. */
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
