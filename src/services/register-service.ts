import { api } from 'boot/axios';
import { Register } from 'src/ts/interfaces/data/Register';

const baseUrl = 'register';

export const getRegistersService = (
  period: string
): Promise<{
  status: number;
  data: {
    registers: Register[];
    filled_data: boolean;
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}/${period}`);

export const getRegisterDetailService = (
  id: string
): Promise<{
  status: number;
  data: {
    register: string;
    message: string;
  };
}> => api.get(`${baseUrl}/${id}`);
