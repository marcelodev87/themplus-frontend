import { api } from 'boot/axios';
import { Alert } from 'src/ts/interfaces/data/Alert';

const baseUrl = 'alert';

export const getAlertsService = (): Promise<{
  status: number;
  data: {
    alerts: Alert[];
    filled_data: boolean;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const createAlertService = (
  description: string | null
): Promise<{
  status: number;
  data: {
    alerts: Alert[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, { description });

export const updateAlertService = (
  id: string,
  description: string | null
): Promise<{
  status: number;
  data: {
    alerts: Alert[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    description,
  });

export const deleteAlertService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
