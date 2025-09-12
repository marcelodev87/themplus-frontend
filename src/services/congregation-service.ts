import { api } from 'boot/axios';
import {
  Congregation,
  DataCongregation,
} from 'src/ts/interfaces/data/Congregation';

const baseUrl = 'congregation';

export const getCongregationsService = (): Promise<{
  status: number;
  data: {
    congregations: Congregation[];
    filled_data: boolean;
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const createCongregationService = (
  data: DataCongregation
): Promise<{
  status: number;
  data: {
    congregations: Congregation[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateCongregationService = (
  data: DataCongregation
): Promise<{
  status: number;
  data: {
    congregations: Congregation[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, data);

export const deleteCongregationService = (
  id: string
): Promise<{
  status: number;
  data: {
    congregations: Congregation[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
