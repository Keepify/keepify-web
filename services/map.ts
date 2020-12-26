import axios from 'axios';
import { API_DOMAIN } from 'constants/api';
import { LatLng } from 'types';

type GeocodeFeature = {
  bbox: number[];
  center: number[];
  geometry: { type: string; coordinates: number[] };
  id: string;
  matching_place_name: string;
  matching_text: string;
  place_name: string;
  place_type: string[];
  properties: { wikidata: string; short_code: string };
  relevance: number;
  text: string;
  type: string;
};

type GeocodePayload = {
  attribution: string;
  features: GeocodeFeature[];
  query: string[];
  type: string;
};

export async function getGeocode(query: string) {
  try {
    const { data } = await axios.get<GeocodePayload>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
    );

    return data;
  } catch (e) {
    throw e;
  }
}

type GeoLocationPayload = {
  plus_code: {
    compound_code: string;
    global_code: string;
  };
};

export async function getLocationByCode({ latitude, longitude }: LatLng) {
  try {
    const { data } = await axios.get<GeoLocationPayload>(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    const [, ...result] = data.plus_code.compound_code.split(' ');

    return result;
  } catch (e) {
    throw e;
  }
}

export async function getDropzones({ latitude, longitude }: LatLng) {
  try {
    const { data } = await axios.get(`${API_DOMAIN}/dropzones/lat=${latitude}&lng=${longitude}`);

    return data;
  } catch (e) {
    throw e;
  }
}
