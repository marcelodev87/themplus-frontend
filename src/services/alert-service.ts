import { api } from 'boot/axios';
import { Category } from 'src/ts/interfaces/data/Category';

const baseUrl = 'alert';

export const getCategoriesService = (
  enterpriseId: string
): Promise<{
  status: number;
  data: {
    categories: Category[];
  };
}> => api.get(`${baseUrl}/${enterpriseId}`);

export const updateAlertService = (
  categories: { id: string; alert: string | null }[],
  enterpriseId: string
): Promise<{
  status: number;
  data: {
    categories: Category[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    categories,
    enterpriseId,
  });
