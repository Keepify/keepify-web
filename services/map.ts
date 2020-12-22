import axios from 'axios';

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
