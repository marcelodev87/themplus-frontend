/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { AxiosError } from 'axios';
import {
  AccountInformation,
  CategoryInformation,
} from 'src/ts/interfaces/data/InformationsForms';
import { InsertMovementData, Movement } from 'src/ts/interfaces/data/Movement';

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
    message: string;
  };
}> => api.get(`${baseUrl}/${date}`);

export const getMovementsWithParamsService = (
  entry: boolean,
  out: boolean,
  date: string
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    months_years: string[];
    message: string;
  };
}> => api.get(`${baseUrl}/filter/${date}?entry=${entry}&out=${out}`);

export const getMovementInformationsService = (
  type: string | null
): Promise<{
  status: number;
  data: {
    categories: CategoryInformation[];
    accounts: AccountInformation[];
  };
}> => api.get(`${baseUrl}/informations/${type ?? 'all'}`);

// export const createMovementService = (
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
//     movements: Movement[];
//     months_years: string[];
//     message: string;
//   };
// }> =>
//   api.post(`${baseUrl}/`, {
//     type,
//     value,
//     date,
//     description,
//     file,
//     category,
//     account,
//     programmed,
//   });

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

export const insertMovementService = (
  movements: InsertMovementData[]
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    months_years: string[];
    message: string;
  };
}> => api.post(`${baseUrl}/insert`, { movements });

export const exportMovementService = async (
  entry: boolean,
  out: boolean,
  date: string
) => {
  try {
    const response = await api.post(
      `${baseUrl}/export/${date}?entry=${entry}&out=${out}`,
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
export const downloadFileService = async (file: string) => {
  try {
    const response = await api.get(`${baseUrl}/download/${file}`, {
      responseType: 'blob',
    });

    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `comprovante_${timestamp}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};

// export const updateMovementService = (
//   id: string,
//   type: string,
//   value: string,
//   date: string,
//   description: string | null,
//   file: File | null,
//   category: string,
//   account: string
// ): Promise<{
//   status: number;
//   data: {
//     movements: Movement[];
//     months_years: string[];
//     message: string;
//   };
// }> => {
//   const formData = new FormData();

//   formData.append('id', id);
//   formData.append('type', type);
//   formData.append('value', value);
//   formData.append('date', date);
//   if (description) formData.append('description', description);
//   formData.append('category', category);
//   formData.append('account', account);

//   if (file) {
//     formData.append('file', file);
//   }

//   return api.put(`${baseUrl}/`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };
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
    months_years: string[];
    message: string;
  };
}> => {
  const formData = new FormData();

  // Use JSON.stringify para garantir que os valores sejam transmitidos corretamente
  formData.append('id', JSON.stringify(id));
  formData.append('type', JSON.stringify(type));
  formData.append('value', JSON.stringify(value));
  formData.append('date', JSON.stringify(date));

  if (description) {
    formData.append('description', JSON.stringify(description));
  }

  formData.append('category', JSON.stringify(category));
  formData.append('account', JSON.stringify(account));

  if (file) {
    formData.append('file', file);
  }

  return api.put(`${baseUrl}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteMovementService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
