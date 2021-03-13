import axios from 'axios';
import { API_DOMAIN } from 'constants/api';

export async function getTransactions() {
  try {
    const { data } = await axios.get(`${API_DOMAIN}/transactions/`);

    return data;
  } catch (e) {
    throw e;
  }
}
