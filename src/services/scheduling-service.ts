import { api } from 'boot/axios';
import {
  AccountInformation,
  CategoryInformation,
} from 'src/ts/interfaces/data/InformationsForms';
import { Scheduling } from 'src/ts/interfaces/data/Scheduling';

const baseUrl = 'scheduling';

export const getSchedulingsService = (): Promise<{
  status: number;
  data: {
    schedulings: Scheduling[];
  };
}> => api.get(`${baseUrl}`);

export const getSchedulingsWithParamsService = (
  expired: boolean,
  entry: boolean,
  out: boolean
): Promise<{
  status: number;
  data: {
    schedulings: Scheduling[];
    message: string;
  };
}> => api.get(`${baseUrl}/filter?expired=${expired}&entry=${entry}&out=${out}`);

export const getSchedulingInformationsService = (
  type: string
): Promise<{
  status: number;
  data: {
    categories: CategoryInformation[];
    accounts: AccountInformation[];
  };
}> => api.get(`${baseUrl}/informations/${type}`);

export const createSchedulingService = (
  type: string,
  value: string,
  date: string,
  description: string | null,
  file: File | null,
  category: string,
  account: string
): Promise<{
  status: number;
  data: {
    schedulings: Scheduling[];
    message: string;
  };
}> =>
  api.post(`${baseUrl}/`, {
    type,
    value,
    date,
    description,
    file,
    category,
    account,
  });

export const updateSchedulingService = (
  id: string,
  type: string,
  value: string,
  date: string,
  description: string | null,
  file: File | null,
  category: string,
  account: string
): Promise<{
  status: number;
  data: {
    schedulings: Scheduling[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    type,
    value,
    date,
    description,
    file,
    category,
    account,
  });

export const finalizeSchedulingService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.put(`${baseUrl}/finalize/${id}`);
export const deleteSchedulingService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
