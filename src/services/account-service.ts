import { api } from 'boot/axios';
import { Account } from 'src/ts/interfaces/data/Account';

const baseUrl = 'account';

export const getAccountsService = (): Promise<{
    status: number;
    data: {
      accounts: Account[];
      message: string;
    };
}> => api.get(`${baseUrl}`);

export const createAccountService = (
  name: string,
  accountNumber: string,
  agencyNumber: string,
  description: string | null,
): Promise<{
    status: number;
    data: {
      accounts: Account[];
      message: string;
    };
}> => api.post(`${baseUrl}/`, {
  name, accountNumber, agencyNumber, description,
});

export const updateAccountService = (
  id: string,
  name: string,
  accountNumber: string,
  agencyNumber: string,
  description: string | null,
): Promise<{
    status: number;
    data: {
      accounts: Account[];
      message: string;
    };
}> => api.put(`${baseUrl}/`, {
  id, accountNumber, agencyNumber, description,
});

export const deleteAccountService = (
  id: string,
): Promise<{
    status: number;
    data: {
        message: string;
    };
}> => api.delete(`${baseUrl}/${id}`);
