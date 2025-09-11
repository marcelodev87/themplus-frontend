import { api } from 'boot/axios';
import { DataMemberChurch, MemberChurch } from 'src/ts/interfaces/data/Member';

const baseUrl = 'member-church';

export const getMembersService = (): Promise<{
  status: number;
  data: {
    members: MemberChurch[];
    filled_data: boolean;
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}`);

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

export const deleteMemberService = (
  id: string
): Promise<{
  status: number;
  data: {
    members: MemberChurch[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
