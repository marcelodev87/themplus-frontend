import { api } from 'boot/axios';
import {
  ConfigPreRegistration,
  DataMemberChurch,
  DataPreRegistration,
  MemberChurch,
  PreRegistration,
} from 'src/ts/interfaces/data/Member';

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

export const getPreRegistrationService = (): Promise<{
  status: number;
  data: {
    pre_registration: PreRegistration[];
  };
}> => api.get(`${baseUrl}/pre-registration`);

export const getConfigPreRegistrationService = (): Promise<{
  status: number;
  data: {
    config: ConfigPreRegistration;
  };
}> => api.get(`${baseUrl}/pre-registration/config`);

export const checkActivePreRegistration = (
  enterpriseID: string
): Promise<{
  status: number;
  data: {
    active: boolean;
  };
}> => api.get(`/active-pre-registration/${enterpriseID}`);

export const createMemberService = (
  data: DataMemberChurch
): Promise<{
  status: number;
  data: {
    members: MemberChurch[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const createPreRegistrationService = (
  data: DataPreRegistration
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`create-pre-registration/`, data);

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

export const deleteRegistrationService = (
  id: string
): Promise<{
  status: number;
  data: {
    pre_registration: PreRegistration[];
    message: string;
  };
}> => api.delete(`${baseUrl}/pre-registration/${id}`);
