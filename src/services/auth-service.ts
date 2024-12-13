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

export const doResetService = (
  email: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post('/reset', { email });
export const doVerifyService = (
  code: string,
  email: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post('/verify', { code, email });
export const setNewPasswordService = (
  password: string,
  email: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post('/newPassword', { password, email });

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
  email: string,
  phone: string | null,
  department: string | null
): Promise<{
  status: number;
  data: {
    user: User;
    message: string;
  };
}> => api.put(`${baseUrl}/data`, { name, email, phone, department });

export const updateUserPasswordService = (
  passwordActual: string,
  passwordNew: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.put(`${baseUrl}/password`, { passwordActual, passwordNew });
