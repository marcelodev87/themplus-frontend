/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'boot/axios';
import {
  AccountInformation,
  CategoryInformation,
} from 'src/ts/interfaces/data/InformationsForms';

import { MovementAnalyze } from 'src/ts/interfaces/data/Movement';

const baseUrl = 'movement-analyze';

export const getMovementsAnalyzeService = (): Promise<{
  status: number;
  data: {
    movements_analyze: MovementAnalyze[];
    categories: CategoryInformation[];
    accounts: AccountInformation[];
  };
}> => api.get(`${baseUrl}/`);

export const finalizeMovementAnalyzeService = (
  id: string,
  account: string,
  category: string,
  dateMovement: string,
  description: string | null,
  enterpriseId: string,
  receipt: File | null,
  type: string,
  value: string
): Promise<{
  status: number;
  data: {
    movements_analyze: MovementAnalyze[];
    categories: CategoryInformation[];
    accounts: AccountInformation[];
    message: string;
  };
}> => {
  const formData = new FormData();

  formData.append('id', id);
  formData.append('type', type);
  formData.append('value', value);
  formData.append('date', dateMovement);
  if (description) formData.append('description', description);
  formData.append('category', category);
  formData.append('account', account);
  formData.append('enterpriseId', enterpriseId);

  if (receipt) {
    formData.append('file', receipt);
  }

  return api.post(`${baseUrl}/finalize`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteMovementsAnalyzeService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
