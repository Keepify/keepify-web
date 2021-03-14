import axios from 'axios';
import { API_DOMAIN } from 'constants/api';
import { Transaction } from 'types/transaction';

export async function getTransactions() {
  try {
    const { data } = await axios.get<{ transactions: Transaction[] }>(
      `${API_DOMAIN}/transactions/`
    );

    return data.transactions;
  } catch (e) {
    throw e;
  }
}

export async function getTransaction(id: string) {
  try {
    const { data } = await axios.get<{ transactions: Transaction[] }>(
      `${API_DOMAIN}/transactions/?uuid=${id}`
    );

    return data.transactions[0];
  } catch (e) {
    throw e;
  }
}
