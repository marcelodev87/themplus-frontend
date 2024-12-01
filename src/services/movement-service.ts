/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { AxiosError } from 'axios';
import {
  AccountInformation,
  CategoryInformation,
} from 'src/ts/interfaces/data/InformationsForms';
import { Movement } from 'src/ts/interfaces/data/Movement';

const baseUrl = 'movement';

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

export const getMovementsService = (): Promise<{
  status: number;
  data: {
    movements: Movement[];
    filled_data: boolean;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const getMovementsWithParamsService = (
  entry: boolean,
  out: boolean
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    message: string;
  };
}> => api.get(`${baseUrl}/filter?entry=${entry}&out=${out}`);

export const getMovementInformationsService = (
  type: string
): Promise<{
  status: number;
  data: {
    categories: CategoryInformation[];
    accounts: AccountInformation[];
  };
}> => api.get(`${baseUrl}/informations/${type}`);

export const createMovementService = (
  type: string,
  value: string,
  date: string,
  description: string | null,
  file: File | null,
  category: string,
  account: string
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    message: string;
  };
}> =>
  api.post(`${baseUrl}/`, {
    type,
    value,
    date,
    description,
    file,
    category,
    account,
  });

export const exportMovementService = async (entry: boolean, out: boolean) => {
  try {
    const response = await api.post(
      `${baseUrl}/export?entry=${entry}&out=${out}`,
      null,
      {
        responseType: 'blob',
      }
    );
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');

    const url2 = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url2;
    link.setAttribute('download', `movimentacoes_${timestamp}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};

export const updateMovementService = (
  id: string,
  type: string,
  value: string,
  date: string,
  description: string | null,
  file: File | null,
  category: string,
  account: string
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    type,
    value,
    date,
    description,
    file,
    category,
    account,
  });

export const deleteMovementService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
