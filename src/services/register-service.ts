import { api } from 'boot/axios';
import { Register } from 'src/ts/interfaces/data/Register';

const baseUrl = 'register';

export const getRegistersService = (): Promise<{
  status: number;
  data: {
    registers: Register[];
    filled_data: boolean;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const getRegisterDetailService = (
  id: string
): Promise<{
  status: number;
  data: {
    register: Register;
    message: string;
  };
}> => api.get(`${baseUrl}/${id}`);
