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

export const createCategoryService = (
  name: string,
  type: string,
): Promise<{
    status: number;
    data: {
      categories: Category[];
      message: string;
    };
}> => api.post(`${baseUrl}/`, { name, type });

export const updateCategoryService = (
  id: string,
  name: string,
  type: string,
): Promise<{
    status: number;
    data: {
      categories: Category[];
      message: string;
    };
}> => api.put(`${baseUrl}/`, {
  id, name, type,
});

export const deleteCategoryService = (
  id: string,
): Promise<{
    status: number;
    data: {
        message: string;
    };
}> => api.delete(`${baseUrl}/${id}`);
