import { api } from 'boot/axios';
import { DataMinistry, Ministry } from 'src/ts/interfaces/data/Ministry';

const baseUrl = 'ministry';

export const getMinistriesService = (): Promise<{
  status: number;
  data: {
    ministries: Ministry[];
    filled_data: boolean;
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const createMinistryService = (
  data: DataMinistry
): Promise<{
  status: number;
  data: {
    ministries: Ministry[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateMinistryService = (
  data: DataMinistry
): Promise<{
  status: number;
  data: {
    ministries: Ministry[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, data);

export const deleteMinistryService = (
  id: string
): Promise<{
  status: number;
  data: {
    ministries: Ministry[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
