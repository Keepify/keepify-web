import axios from 'axios';
import { API_DOMAIN } from 'constants/api';
import { LatLng } from 'types';
import { DropzoneListItem } from 'types/dropzone';

export async function getDropzones({ latitude, longitude }: LatLng) {
  try {
    const { data } = await axios.get<{ data: DropzoneListItem[] }>(
      `${API_DOMAIN}/dropzones?lat=${latitude}&lng=${longitude}`
    );

    return data.data;
  } catch (e) {
    throw e;
  }
}

export async function getDropzone(id: string) {
  try {
    const { data } = await axios.get<{ dropzone: DropzoneListItem }>(
      `${API_DOMAIN}/get-dropzone?id=${id}`
    );

    return data.dropzone;
  } catch (e) {
    throw e;
  }
}
