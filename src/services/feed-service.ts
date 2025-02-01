import { api } from 'boot/axios';

const baseUrl = 'feed';

export const getFeedService = (): Promise<{
  status: number;
  data: {
    filled_data: boolean;
    notifications: number;
  };
}> => api.get(`${baseUrl}`);
