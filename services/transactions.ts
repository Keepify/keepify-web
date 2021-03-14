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
