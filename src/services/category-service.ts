/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { Category, CategoryPanel } from 'src/ts/interfaces/data/Category';

const baseUrl = 'category';

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

export const getCategoriesService = (): Promise<{
  status: number;
  data: {
    categories: Category[];
    filled_data: boolean;
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const getCategoryById = (
  id: string
): Promise<{
  status: number;
  data: {
    category: Category;
    message: string;
  };
}> => api.get(`${baseUrl}/${id}`);

export const getEnterpriseCategoryByCounter = (
  type: string,
  classification: string
): Promise<{
  status: number;
  data: {
    categories: CategoryPanel[];
    message: string;
  };
}> => api.get(`${baseUrl}/panel?type=${type}&classification=${classification}`);

export const getCategoriesWithParamsService = (
  createdByMe: boolean,
  defaultSystem: boolean
): Promise<{
  status: number;
  data: {
    categories: Category[];
    message: string;
  };
}> =>
  api.get(
    `${baseUrl}/filter?createdByMe=${createdByMe}&defaultSystem=${defaultSystem}`
  );

export const createCategoryService = (
  name: string,
  type: string,
  alert: string | null
): Promise<{
  status: number;
  data: {
    categories: Category[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, { name, type, alert });

export const updateCategoryService = (
  id: string,
  name: string,
  type: string,
  alert: string | null
): Promise<{
  status: number;
  data: {
    categories: Category[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    type,
    alert,
  });
export const updateCategoryCodeService = (data: {
  id: string | null;
  name: string;
  codeDebt: number | null;
  codeCredit: number | null;
}): Promise<{
  status: number;
  data: {
    categories: CategoryPanel[];
    message: string;
  };
}> => api.put(`${baseUrl}/code`, data);
export const updateActiveCategoryService = (
  id: string
): Promise<{
  status: number;
  data: {
    categories: Category[];
    message: string;
  };
}> => api.put(`${baseUrl}/active/${id}`);

export const exportCategoryService = async () => {
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
    link.setAttribute('download', `categorias_${timestamp}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};

export const deleteCategoryService = (
  id: string
): Promise<{
  status: number;
  data: {
    categories: Category[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
