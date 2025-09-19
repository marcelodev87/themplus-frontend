import { api } from 'boot/axios';
import { Network, DataNetwork } from 'src/ts/interfaces/data/Network';

const baseUrl = 'network';

export const getNetworksService = (): Promise<{
  status: number;
  data: {
    networks: Network[];
    filled_data: boolean;
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const createNetworkService = (
  data: DataNetwork
): Promise<{
  status: number;
  data: {
    networks: Network[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateNetworkService = (
  data: DataNetwork
): Promise<{
  status: number;
  data: {
    networks: Network[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, data);

export const deleteNetworkService = (
  id: string
): Promise<{
  status: number;
  data: {
    networks: Network[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
