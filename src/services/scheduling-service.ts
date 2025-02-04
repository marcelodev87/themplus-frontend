/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import {
  AccountInformation,
  CategoryInformation,
} from 'src/ts/interfaces/data/InformationsForms';
import { Scheduling } from 'src/ts/interfaces/data/Scheduling';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';

const baseUrl = 'scheduling';

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
export const getSchedulingsService = (
  date: string
): Promise<{
  status: number;
  data: {
    schedulings: Scheduling[];
    months_years: string[];
    categories: QuasarSelect<string>[];
    notifications: number;
    filled_data: boolean;
  };
}> => api.get(`${baseUrl}/${date}`);

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

export const getSchedulingsWithParamsService = (
  expired: boolean,
  entry: boolean,
  out: boolean,
  date: string,
  categoryId: string | null
): Promise<{
  status: number;
  data: {
    schedulings: Scheduling[];
    months_years: string[];
    categories: QuasarSelect<string>[];
    message: string;
  };
}> =>
  api.get(
    `${baseUrl}/filter/${date}?expired=${expired}&entry=${entry}&out=${out}&category=${categoryId}`
  );

export const getSchedulingInformationsService = (
  type: string
): Promise<{
  status: number;
  data: {
    categories: CategoryInformation[];
    accounts: AccountInformation[];
  };
}> => api.get(`${baseUrl}/informations/${type}`);

export const exportSchedulingExcelService = async (
  entry: boolean,
  out: boolean,
  expired: boolean,
  date: string,
  categoryId: string | null
) => {
  try {
    const response = await api.post(
      `${baseUrl}/export/excel/${date}?entry=${entry}&out=${out}&expired=${expired}&category=${categoryId}`,
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
    link.setAttribute('download', `agendamentos_${timestamp}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};
export const exportSchedulingPDFService = async (
  entry: boolean,
  out: boolean,
  expired: boolean,
  date: string,
  categoryId: string | null
) => {
  try {
    const response = await api.post(
      `${baseUrl}/export/pdf/${date}?entry=${entry}&out=${out}&expired=${expired}&category=${categoryId}`,
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
    link.setAttribute('download', `agendamentos_${timestamp}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};

export const createSchedulingService = (
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
    schedulings: Scheduling[];
    months_years: string[];
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

// export const createSchedulingService = (
//   type: string,
//   value: string,
//   date: string,
//   description: string | null,
//   file: File | null,
//   category: string,
//   account: string,
//   programmed: number
// ): Promise<{
//   status: number;
//   data: {
//     schedulings: Scheduling[];
//     months_years: string[];
//     message: string;
//   };
// }> => {
//   const formData = new FormData();
//   formData.append('type', type);
//   formData.append('value', value);
//   formData.append('date', date);
//   formData.append('description', description || ''); // Adiciona uma string vazia se for null
//   if (file) {
//     formData.append('file', file); // Adiciona o arquivo se não for null
//   }
//   formData.append('category', category);
//   formData.append('account', account);
//   formData.append('programmed', programmed.toString()); // Converte o número para string

//   return api.post(`${baseUrl}/`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };

export const updateSchedulingService = (
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
    schedulings: Scheduling[];
    months_years: string[];
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

export const finalizeSchedulingService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.put(`${baseUrl}/finalize/${id}`);
export const deleteSchedulingService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
