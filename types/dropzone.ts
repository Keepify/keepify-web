import { User } from './user';

export type DropzoneListItem = {
  id: string;
  name: string;
  host: User;
  thumbnail: string;
  location: {
    lat: number;
    lng: number;
  };
  rate: number;
  unit: string;
  rating: number;
  type: string;
  services: string[];
};
