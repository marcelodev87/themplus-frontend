import { api } from 'src/boot/axios';
import { User } from 'src/ts/interfaces/data/User';

const baseUrl = 'user';

export const doLoginService = (
  email: string,
  password: string
): Promise<{
  status: number;
  data: {
    user: User;
    token: string;
  };
}> => api.post('/login', { email, password });

export const doRegisterService = (
  name: string,
  email: string,
  password: string,
  nameEnterprise: string
): Promise<{
  status: number;
  data: {
    user: User;
    token: string;
    message: string;
  };
}> =>
  api.post('/register', {
    email,
    password,
    name,
    nameEnterprise,
  });

export const updateUserDataService = (
  name: string,
  email: string
): Promise<{
  status: number;
  data: {
    user: User;
    message: string;
  };
}> => api.put(`${baseUrl}/data`, { name, email });

export const updateUserPasswordService = (
  passwordActual: string,
  passwordNew: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.put(`${baseUrl}/password`, { passwordActual, passwordNew });
