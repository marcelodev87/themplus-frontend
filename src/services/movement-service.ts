/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { AxiosError } from 'axios';
import {
  AccountInformation,
  CategoryInformation,
} from 'src/ts/interfaces/data/InformationsForms';
import { InsertMovementData, Movement } from 'src/ts/interfaces/data/Movement';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';

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

export const getMovementsService = (
  date: string
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    months_years: string[];
    filled_data: boolean;
    delivered: boolean;
    categories: QuasarSelect<string>[];
    movements_analyze: number;
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}/${date}`);

export const getMovementsWithParamsService = (
  entry: boolean,
  out: boolean,
  date: string,
  category: string | null
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    months_years: string[];
    delivered: boolean;
    categories: QuasarSelect<string>[];
    message: string;
  };
}> =>
  api.get(
    `${baseUrl}/filter/${date}?entry=${entry}&out=${out}&category=${category}`
  );

export const getMovementInformationsService = (
  type: string | null,
  enterpriseId: string | null
): Promise<{
  status: number;
  data: {
    categories: CategoryInformation[];
    accounts: AccountInformation[];
  };
}> => {
  const url = `${baseUrl}/informations/${type ?? 'all'}`;
  const finalUrl = enterpriseId ? `${url}?enterpriseId=${enterpriseId}` : url;

  return api.get(finalUrl);
};

export const createMovementService = (
  type: string,
  value: string,
  date: string,
  description: string | null,
  file: File | null,
  category: string,
  account: string,
  programmed: number
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    months_years: string[];
    delivered: boolean;
    message: string;
  };
}> => {
  const formData = new FormData();

  formData.append('type', type);
  formData.append('value', value);
  formData.append('date', date);
  if (description) formData.append('description', description);
  formData.append('category', category);
  formData.append('account', account);
  formData.append('programmed', programmed.toString());

  if (file) {
    formData.append('file', file);
  }

  return api.post(`${baseUrl}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const updateMovementService = (
  id: string,
  type: string,
  value: string,
  date: string,
  description: string | null,
  file: File | string | null,
  category: string,
  account: string
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    months_years: string[];
    delivered: boolean;
    message: string;
  };
}> => {
  const formData = new FormData();

  formData.append('id', id);
  formData.append('type', type);
  formData.append('value', value);
  formData.append('date', date);
  if (description) formData.append('description', description);
  formData.append('category', category);
  formData.append('account', account);

  if (file) {
    formData.append('file', file);
  }

  return api.post(`${baseUrl}/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const insertMovementService = (
  listMovements: InsertMovementData[]
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    months_years: string[];
    delivered: boolean;
    categories: QuasarSelect<string>[];
    notifications: number;
    message: string;
  };
}> => {
  const formData = new FormData();

  listMovements.forEach((movement, index) => {
    formData.append(`movements[${index}][type]`, movement.type);
    formData.append(`movements[${index}][value]`, movement.value);
    formData.append(`movements[${index}][date]`, movement.date);

    if (movement.description) {
      formData.append(`movements[${index}][description]`, movement.description);
    }
    formData.append(`movements[${index}][category]`, movement.category);
    formData.append(`movements[${index}][account]`, movement.account);
    formData.append(
      `movements[${index}][programmed]`,
      movement.programmed.toString()
    );

    if (movement.receipt) {
      formData.append(`movements[${index}][receipt]`, movement.receipt);
    }
  });

  return api.post(`${baseUrl}/insert`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const saveObservationsService = (
  movements: { id: string; observation: string | null }[]
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`${baseUrl}/observations`, { movements });

export const exportMovementExcelService = async (
  entry: boolean,
  out: boolean,
  date: string,
  categoryId: string | null
) => {
  try {
    const response = await api.post(
      `${baseUrl}/export/excel/${date}?entry=${entry}&out=${out}&category=${categoryId}`,
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

export const exportMovementPDFService = async (
  entry: boolean,
  out: boolean,
  date: string,
  categoryId: string | null
) => {
  try {
    const response = await api.post(
      `${baseUrl}/export/pdf/${date}?entry=${entry}&out=${out}&category=${categoryId}`,
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
    link.setAttribute('download', `movimentacoes_${timestamp}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};

export const exportMovementInsertExampleService = async () => {
  try {
    const response = await api.post(`${baseUrl}/insert-example/`, null, {
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
    link.setAttribute(
      'download',
      `movimentacoes_insert_example_${timestamp}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};

export const downloadFileService = async (url: string) => {
  if (url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not OK');
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = '';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download file:', error);
      console.warn('URL do arquivo não disponível');
    }
  } else {
    console.warn('URL do arquivo não disponível');
  }
};

export const deleteMovementService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
