import { api } from 'boot/axios';
import { Category } from 'src/ts/interfaces/data/Category';

const baseUrl = 'category';

export const getCategoriesService = (): Promise<{
  status: number;
  data: {
    categories: Category[];
    message: string;
  };
}> => api.get(`${baseUrl}`);

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

export const deleteCategoryService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
