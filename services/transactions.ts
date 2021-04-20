import axios from 'axios';
import { API_DOMAIN } from 'constants/api';
import { Transaction, TStatus } from 'types/transaction';

type GetTransactionParams = {
  status?: string;
};

export async function getTransactions(params?: GetTransactionParams) {
  try {
    const { data } = await axios.get<{ transactions: Transaction[] }>(
      `${API_DOMAIN}/transactions/?${params?.status ? new URLSearchParams(params).toString() : ''}`
    );

    return data.transactions;
  } catch (e) {
    throw e;
  }
}

export async function getTransaction(id: string) {
  try {
    const { data } = await axios.get<{ transaction: Transaction }>(
      `${API_DOMAIN}/transactions/${id}`
    );

    return data.transaction;
  } catch (e) {
    throw e;
  }
}

export async function updateTransactionStatus(transactionID: string, status: TStatus) {
  try {
    const { data } = await axios.patch<{ transaction: Transaction }>(
      `${API_DOMAIN}/transactions/${transactionID}`,
      { status }
    );

    return data.transaction;
  } catch (e) {
    throw e;
  }
}
