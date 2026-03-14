/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import {
  ConfigPreRegistration,
  DataMemberChurch,
  DataPreRegistration,
  MemberChurch,
  PreRegistration,
} from 'src/ts/interfaces/data/Member';

const baseUrl = 'member-church';

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

export const showMemberService = (
  memberID: string
): Promise<{
  status: number;
  data: {
    member: MemberChurch;
  };
}> => api.get(`${baseUrl}/${memberID}`);

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
}> => {
  const formData = new FormData();

  const appendIfExists = (
    key: string,
    value: string | number | null | undefined
  ) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, String(value));
    }
  };

  appendIfExists('name', data.name);
  appendIfExists('dateBirth', data.dateBirth);
  appendIfExists('profession', data.profession);
  appendIfExists('naturalness', data.naturalness);
  appendIfExists('maritalStatus', data.maritalStatus);
  appendIfExists('education', data.education);
  appendIfExists('cpf', data.cpf);
  appendIfExists('email', data.email);
  appendIfExists('emailProfessional', data.emailProfessional);
  appendIfExists('phone', data.phone);
  appendIfExists('phoneProfessional', data.phoneProfessional);
  appendIfExists('cep', data.cep);
  appendIfExists('address', data.address);
  appendIfExists('complement', data.complement);
  appendIfExists('neighborhood', data.neighborhood);
  appendIfExists('city', data.city);
  appendIfExists('uf', data.uf);
  appendIfExists('addressNumber', data.addressNumber);
  appendIfExists('type', data.type);
  appendIfExists('active', data.active);
  appendIfExists('dateBaptismo', data.dateBaptismo);
  appendIfExists('startDate', data.startDate);
  appendIfExists('endDate', data.endDate);
  appendIfExists('churchStartDate', data.churchStartDate);
  appendIfExists('churchEndDate', data.churchEndDate);

  if (data.roles?.length) {
    data.roles.forEach((role) => {
      formData.append('roles[]', role);
    });
  }

  if (data.ministries?.length) {
    data.ministries.forEach((ministry) => {
      formData.append('ministries[]', ministry);
    });
  }

  if (data.family) {
    formData.append('family', JSON.stringify(data.family));
  }

  if (data.photoAdd instanceof File) {
    formData.append('photoAdd', data.photoAdd);
  }

  if (data.photoDelete) {
    formData.append('photoDelete', 'true');
  }

  return api.post(`${baseUrl}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createPreRegistrationService = (
  data: DataPreRegistration
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post('create-pre-registration/', data);

export const updateMemberService = (
  id: string,
  data: DataMemberChurch
): Promise<{
  status: number;
  data: {
    members: MemberChurch[];
    message: string;
  };
}> => {
  const formData = new FormData();

  const appendIfExists = (
    key: string,
    value: string | number | null | undefined
  ) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, String(value));
    }
  };

  formData.append('id', id);

  appendIfExists('name', data.name);
  appendIfExists('dateBirth', data.dateBirth);
  appendIfExists('profession', data.profession);
  appendIfExists('naturalness', data.naturalness);
  appendIfExists('maritalStatus', data.maritalStatus);
  appendIfExists('education', data.education);
  appendIfExists('cpf', data.cpf);
  appendIfExists('email', data.email);
  appendIfExists('emailProfessional', data.emailProfessional);
  appendIfExists('phone', data.phone);
  appendIfExists('phoneProfessional', data.phoneProfessional);
  appendIfExists('cep', data.cep);
  appendIfExists('address', data.address);
  appendIfExists('complement', data.complement);
  appendIfExists('neighborhood', data.neighborhood);
  appendIfExists('city', data.city);
  appendIfExists('uf', data.uf);
  appendIfExists('addressNumber', data.addressNumber);
  appendIfExists('type', data.type);
  appendIfExists('active', data.active);
  appendIfExists('dateBaptismo', data.dateBaptismo);
  appendIfExists('startDate', data.startDate);
  appendIfExists('endDate', data.endDate);
  appendIfExists('churchStartDate', data.churchStartDate);
  appendIfExists('churchEndDate', data.churchEndDate);

  if (data.roles?.length) {
    data.roles.forEach((role) => {
      formData.append('roles[]', role);
    });
  }

  if (data.ministries?.length) {
    data.ministries.forEach((ministry) => {
      formData.append('ministries[]', ministry);
    });
  }

  if (data.family) {
    formData.append('family', JSON.stringify(data.family));
  }

  if (data.photoAdd instanceof File) {
    formData.append('photoAdd', data.photoAdd);
  }

  if (data.photoDelete) {
    formData.append('photoDelete', 'true');
  }

  return api.post(`${baseUrl}/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateConfigPreRegistration = (data: {
  active: number;
}): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.put(`${baseUrl}/pre-registration/config`, data);

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

export const deleteRelationshipService = (
  memberID: string,
  relatedMemberID: string,
  relationshipID: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> =>
  api.post(`${baseUrl}/relationship`, {
    memberID,
    relatedMemberID,
    relationshipID,
  });

export const downloadCertificateBaptismoService = async (memberID: string) => {
  try {
    const response = await api.post(
      `${baseUrl}/certificate/${memberID}`,
      null,
      {
        responseType: 'blob',
      }
    );
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');

    const url2 = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url2;
    link.setAttribute('download', `certificate_baptismo_${timestamp}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};

export const downloadWalletMembersService = async (memberIds: string[]) => {
  try {
    const response = await api.post(
      `${baseUrl}/wallet-member`,
      { memberIds },
      {
        responseType: 'blob',
      }
    );
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');

    const url2 = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url2;
    link.setAttribute('download', `wallet_member_${timestamp}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};
