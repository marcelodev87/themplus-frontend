import { api } from 'boot/axios';
import { Office } from 'src/ts/interfaces/data/Enterprise';

const baseUrl = 'office';

export const getOfficesService = (): Promise<{
  status: number;
  data: {
    offices: Office[];
    message: string;
    filled_data: boolean;
  };
}> => api.get(`${baseUrl}`);

export const createOfficeService = (
  name: string,
  cnpj: string | null,
  cpf: string | null,
  cep: string,
  state: string,
  city: string,
  neighborhood: string,
  address: string,
  complement: string | null,
  numberAddress: string,
  email: string | null,
  phone: string | null
): Promise<{
  status: number;
  data: {
    offices: Office[];
    message: string;
  };
}> =>
  api.post(`${baseUrl}/`, {
    name,
    cnpj,
    cpf,
    cep,
    state,
    city,
    neighborhood,
    address,
    complement,
    numberAddress,
    email,
    phone,
  });

// export const updateAlertService = (
//   id: string,
//   description: string | null
// ): Promise<{
//   status: number;
//   data: {
//     alerts: Alert[];
//     message: string;
//   };
// }> =>
//   api.put(`${baseUrl}/`, {
//     id,
//     description,
//   });

export const deleteOfficeService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
