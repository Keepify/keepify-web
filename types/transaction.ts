import { User } from './user';
import { DropzoneListItem } from './dropzone';

export type Transaction = {
  cost: number;
  creation_time: string;
  dropzone: DropzoneListItem;
  host_token: string;
  id: string;
  reservation_end: string;
  reservation_start: string;
  status: TStatus;
  host: User;
  client: User;
  client_note: string;
  client_review: string;
  client_stars: number;
};

export enum TStatus {
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  RECEIVED = 'RECEIVED',
  REDEEMED = 'REDEEMED',
}
