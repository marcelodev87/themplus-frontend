import { api } from 'boot/axios';

const baseUrl = 'feedback';

export const createFeedbackService = (
  message: string | null
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`${baseUrl}/`, { message });
