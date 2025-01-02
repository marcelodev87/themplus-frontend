import { api } from 'boot/axios';
import { Order } from 'src/ts/interfaces/data/Order';

const baseUrl = 'order';

export const getOrdersViewClientService = (): Promise<{
  status: number;
  data: {
    orders: Order[];
    filled_data: boolean;
    message: string;
  };
}> => api.get(`${baseUrl}/client`);

export const getOrdersViewCounterService = (): Promise<{
  status: number;
  data: {
    orders: Order[];
    filled_data: boolean;
    message: string;
  };
}> => api.get(`${baseUrl}/counter`);

export const sendRequestEnterpriseService = (
  enterpriseId: string,
  description: string | null
): Promise<{
  status: number;
  data: {
    orders: Order[];
    message: string;
  };
}> => api.post(`${baseUrl}/sendRequest`, { enterpriseId, description });

export const updateRequestEnterpriseService = (
  id: string,
  description: string | null
): Promise<{
  status: number;
  data: {
    orders: Order[];
    message: string;
  };
}> => api.put(`${baseUrl}`, { id, description });

export const actionRequestEnterpriseService = (
  id: string,
  status: 'declined' | 'accepted'
): Promise<{
  status: number;
  data: {
    orders: Order[];
    message: string;
  };
}> => api.post(`${baseUrl}/responseClient`, { id, status });

export const deleteOrderService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
