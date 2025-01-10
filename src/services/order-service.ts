import { api } from 'boot/axios';
import { Bond } from 'src/ts/interfaces/data/Bond';
import { OrderClient, OrderCounter } from 'src/ts/interfaces/data/Order';

const baseUrl = 'order';

export const getOrdersViewClientService = (): Promise<{
  status: number;
  data: {
    orders: OrderClient[];
    filled_data: boolean;
    message: string;
  };
}> => api.get(`${baseUrl}/client`);

export const getOrdersViewCounterService = (): Promise<{
  status: number;
  data: {
    orders: OrderCounter[];
    filled_data: boolean;
    message: string;
  };
}> => api.get(`${baseUrl}/counter`);

export const getBondsService = (): Promise<{
  status: number;
  data: {
    bonds: Bond[];
    filled_data: boolean;
    message: string;
  };
}> => api.get(`${baseUrl}/bonds`);

export const sendRequestEnterpriseService = (
  enterpriseId: string,
  description: string | null
): Promise<{
  status: number;
  data: {
    orders: OrderCounter[];
    message: string;
  };
}> => api.post(`${baseUrl}/sendRequest`, { enterpriseId, description });

export const updateRequestEnterpriseService = (
  id: string,
  description: string | null
): Promise<{
  status: number;
  data: {
    orders: OrderCounter[];
    message: string;
  };
}> => api.put(`${baseUrl}`, { id, description });

export const actionRequestEnterpriseService = (
  id: string,
  status: 'declined' | 'accepted'
): Promise<{
  status: number;
  data: {
    orders: OrderClient[];
    counter: string | null;
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

export const deleteBondService = (
  id: string
): Promise<{
  status: number;
  data: {
    bonds: Bond[];
    message: string;
  };
}> => api.delete(`${baseUrl}/bond/${id}`);
