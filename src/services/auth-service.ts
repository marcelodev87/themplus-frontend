import { api } from 'src/boot/axios';
import { User } from 'src/ts/interfaces/data/User';

export const doLoginService = (email: string, password: string): Promise<{
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
  nameEnterprise: string,
): Promise<{
  status: number;
  data: {
      user: User;
      token: string;
  };
}> => api.post('/register', {
  email,
  password,
  name,
  nameEnterprise,
});
// export const forgotService = (email: string) => api.post('/password/forgot', {
//   email,
// });
