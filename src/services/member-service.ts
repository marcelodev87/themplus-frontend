import { api } from 'boot/axios';
import { DataMemberChurch, MemberChurch } from 'src/ts/interfaces/data/Member';

const baseUrl = 'member-church';

export const getMembersService = (
  active?: number
): Promise<{
  status: number;
  data: {
    members: MemberChurch[];
    filled_data: boolean;
    notifications: number;
    message: string;
  };
}> => {
  return api.get(baseUrl, {
    params: active !== undefined ? { active } : undefined,
  });
};


export const createMemberService = (
  data: DataMemberChurch
): Promise<{
  status: number;
  data: {
    members: MemberChurch[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateMemberService = (
  id: string,
  data: DataMemberChurch
): Promise<{
  status: number;
  data: {
    members: MemberChurch[];
    message: string;
  };
}> => api.put(baseUrl, { id, ...data });

export const updateActiveMemberService = (
  active: number,
  userId: string
): Promise<{
  status: number;
  data: {
    members: MemberChurch[];
    message: string;
  };
}> => api.put(`${baseUrl}/active/`, { active, userId });

export const deleteMemberService = (
  id: string
): Promise<{
  status: number;
  data: {
    members: MemberChurch[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
