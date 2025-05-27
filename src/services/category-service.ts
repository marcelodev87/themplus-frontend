import { api } from 'boot/axios';
import { Category, CategoryPanel } from 'src/ts/interfaces/data/Category';

const baseUrl = 'category';

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

export const deleteCategoryService = (
  id: string
): Promise<{
  status: number;
  data: {
    categories: Category[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
