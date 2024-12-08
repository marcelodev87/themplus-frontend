/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'boot/axios';
import { Account } from 'src/ts/interfaces/data/Account';
import { Notify } from 'quasar';
import { AxiosError } from 'axios';

const baseUrl = 'account';

const createError = (error: any) => {
  let message = 'Error';
  if (error instanceof AxiosError) {
    message = error.response?.data?.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  Notify.create({
    message,
    type: 'negative',
  });
};

export const getAccountsService = (): Promise<{
  status: number;
  data: {
    accounts: Account[];
    filled_data: boolean;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const createAccountService = (
  name: string,
  accountNumber: string | null,
  agencyNumber: string | null,
  description: string | null
): Promise<{
  status: number;
  data: {
    accounts: Account[];
    message: string;
  };
}> =>
  api.post(`${baseUrl}/`, {
    name,
    accountNumber,
    agencyNumber,
    description,
  });

export const createTransferService = (
  accountOut: string,
  accountEntry: string,
  value: string,
  date: string
): Promise<{
  status: number;
  data: {
    accounts: Account[];
    message: string;
  };
}> =>
  api.post(`${baseUrl}/transfer`, {
    accountOut,
    accountEntry,
    value,
    date,
  });

export const exportAccountService = async () => {
  try {
    const response = await api.post(`${baseUrl}/export`, null, {
      responseType: 'blob',
    });
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');

    const url2 = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url2;
    link.setAttribute('download', `contas_${timestamp}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};

export const updateAccountService = (
  id: string,
  name: string,
  accountNumber: string | null,
  agencyNumber: string | null,
  description: string | null
): Promise<{
  status: number;
  data: {
    accounts: Account[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    accountNumber,
    agencyNumber,
    description,
  });

export const updateActiveAccountService = (
  id: string
): Promise<{
  status: number;
  data: {
    accounts: Account[];
    message: string;
  };
}> => api.put(`${baseUrl}/active/${id}`);

export const deleteAccountService = (
  id: string
): Promise<{
  status: number;
  data: {
    accounts: Account[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
