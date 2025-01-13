import { api } from 'boot/axios';
import {
  Enterprise,
  ResultEnterprise,
  ViewEnterprise,
} from 'src/ts/interfaces/data/Enterprise';

const baseUrl = 'enterprise';

export const getEnterpriseService = (): Promise<{
  status: number;
  data: {
    enterprise: Enterprise;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const getEnterprisesViewService = (): Promise<{
  status: number;
  data: {
    enterprises: ViewEnterprise[];
    message: string;
  };
}> => api.get(`${baseUrl}/view`);
export const saveEnterpriseViewService = (
  value: string | null
): Promise<{
  status: number;
  data: {
    enterprises: ViewEnterprise[];
    message: string;
  };
}> => api.post(`${baseUrl}/view`, { viewEnterprise: value });

// export const createCategoryService = (
//   name: string,
//   type: string
// ): Promise<{
//   status: number;
//   data: {
//     categories: Category[];
//     message: string;
//   };
// }> => api.post(`${baseUrl}/`, { name, type });

export const searchEnterpriseService = (
  text: string
): Promise<{
  status: number;
  data: {
    enterprises: ResultEnterprise[];
  };
}> => api.get(`${baseUrl}/search/${text}`);

export const showEnterpriseService = (
  id: string
): Promise<{
  status: number;
  data: {
    counter: Enterprise;
  };
}> => api.get(`${baseUrl}/show/${id}`);

export const sendRequestEnterpriseService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`${baseUrl}/sendRequest`, { id });

export const updateEnterpriseService = (payload: {
  id: string;
  name: string;
  cnpj: string | null;
  cpf: string | null;
  cep: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  complement: string | null;
  number_address: string | null;
  email: string | null;
  phone: string | null;
}): Promise<{
  status: number;
  data: {
    enterprise: Enterprise;
    message: string;
  };
}> => api.put(`${baseUrl}/`, payload);

export const unlinkCounterService = (): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.put(`${baseUrl}/unlink`);

// export const deleteCategoryService = (
//   id: string
// ): Promise<{
//   status: number;
//   data: {
//     message: string;
//   };
// }> => api.delete(`${baseUrl}/${id}`);
