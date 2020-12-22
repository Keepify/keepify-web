import { LatLng } from 'types';

export type DropzoneListItem = {
  id: string;
  location: LatLng;
  photo_urls: string[];
  host: {
    id: string;
    first_name: string;
    last_name: string;
    photo: string;
  };
  location_name: string;
  cost: {
    rate: number;
    currency: string;
    unit: string;
  };
};
