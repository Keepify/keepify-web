import { LatLng } from 'types';

export function calculateDistance(x: LatLng, y: LatLng) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(y.latitude - x.latitude); // deg2rad below
  const dLon = deg2rad(y.longitude - x.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(x.latitude)) *
    Math.cos(deg2rad(y.latitude)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function formatDistance(distance: number) {
  if (distance < 1) {
    return `${Math.floor(distance * 1000)} m`;
  }
  return `${distance.toFixed(2)} km`;
}
