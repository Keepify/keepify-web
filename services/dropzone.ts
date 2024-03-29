import axios from 'axios';
import { API_DOMAIN } from 'constants/api';
import { LatLng } from 'types';
import { DropzoneListItem } from 'types/dropzone';

export async function getAllDropzones() {
  try {
    const { data } = await axios.get<{ dropzones: DropzoneListItem[] }>(`${API_DOMAIN}/dropzones/`);

    return data.dropzones;
  } catch (e) {
    throw e;
  }
}

export async function getDropzones({ latitude, longitude }: LatLng) {
  try {
    const { data } = await axios.get<{ dropzones: DropzoneListItem[] }>(
      `${API_DOMAIN}/dropzones/?lat=${latitude}&lng=${longitude}`
    );

    return data.dropzones;
  } catch (e) {
    throw e;
  }
}

export async function getDropzone(id: string) {
  try {
    const { data } = await axios.get<{ dropzone: DropzoneListItem }>(
      `${API_DOMAIN}/dropzones/${id}`
    );

    return data.dropzone;
  } catch (e) {
    throw e;
  }
}

export async function getHostDropzones(id: string) {
  try {
    const { data } = await axios.get<{ dropzones: DropzoneListItem[] }>(
      `${API_DOMAIN}/users/${id}/dropzones`
    );

    return data.dropzones;
  } catch (e) {
    throw e;
  }
}

export async function toggleDropzoneStatus(id: string, status: boolean) {
  try {
    const { data } = await axios.patch(`${API_DOMAIN}/dropzones/${id}`, { active: status });

    return data;
  } catch (e) {
    throw e;
  }
}
