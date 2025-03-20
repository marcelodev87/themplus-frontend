import { api } from 'boot/axios';

const baseUrl = 'feedback';

export const createFeedbackService = (
  message: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`${baseUrl}/`, { message });
