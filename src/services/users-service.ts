import { api } from 'boot/axios';
import { DataUserMember, User } from 'src/ts/interfaces/data/User';

const baseUrl = 'member';

export const getUsersMembersService = (): Promise<{
  status: number;
  data: {
    users: User[];
  };
}> => api.get(`${baseUrl}`);

export const createUserMemberService = (
  payload: DataUserMember
): Promise<{
  status: number;
  data: {
    users: User[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, payload);

export const updateUserMemberService = (
  id: string,
  name: string,
  email: string,
  phone: string | null,
  position: string,
  departmentId: string | null
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
    departmentId,
  });

export const deleteUserMemberService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
