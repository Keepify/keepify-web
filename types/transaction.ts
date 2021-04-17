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
  status: string;
  user: User;
};

export enum TStatus {
  'PAID',
  'CONFIRMED',
  'RECEIVED',
  'REDEEMED',
}
