/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import {
  AccountInformation,
  CategoryInformation,
} from 'src/ts/interfaces/data/InformationsForms';
import { Scheduling } from 'src/ts/interfaces/data/Scheduling';

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
    filled_data: boolean;
  };
}> => api.get(`${baseUrl}/${date}`);

export const getSchedulingsWithParamsService = (
  expired: boolean,
  entry: boolean,
  out: boolean,
  date: string
): Promise<{
  status: number;
  data: {
    schedulings: Scheduling[];
    months_years: string[];
    message: string;
  };
}> =>
  api.get(
    `${baseUrl}/filter/${date}?expired=${expired}&entry=${entry}&out=${out}`
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

export const exportSchedulingService = async (
  entry: boolean,
  out: boolean,
  expired: boolean,
  date: string
) => {
  try {
    const response = await api.post(
      `${baseUrl}/export/${date}?entry=${entry}&out=${out}&expired=${expired}`,
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
}> =>
  api.post(`${baseUrl}/`, {
    type,
    value,
    date,
    description,
    file,
    category,
    account,
    programmed,
  });

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
