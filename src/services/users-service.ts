/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { DataUserMember2, User } from 'src/ts/interfaces/data/User';

const baseUrl = 'member';

const createError = (error: any) => {
  let message = 'Error';
  if (error instanceof AxiosError) {
    message = error.response?.data?.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  Notify.create({
    message,
    type: 'negative',
  });
};

export const getUsersMembersService = (): Promise<{
  status: number;
  data: {
    users: User[];
  };
}> => api.get(`${baseUrl}`);

export const createUserMemberService = (
  payload: DataUserMember2
): Promise<{
  status: number;
  data: {
    users: User[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, payload);

export const exportUserService = async () => {
  try {
    const response = await api.post(`${baseUrl}/export`, null, {
      responseType: 'blob',
    });
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');

    const url2 = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url2;
    link.setAttribute('download', `usuarios_${timestamp}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};

export const updateUserMemberService = (
  id: string,
  name: string,
  email: string,
  phone: string | null,
  position: string,
  department: string | null
): Promise<{
  status: number;
  data: {
    users: User[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    email,
    phone,
    position,
    department,
  });

export const deleteUserMemberService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
