import { api } from 'boot/axios';
import { Movement } from 'src/ts/interfaces/data/Movement';

const baseUrl = 'movement';

export const getMovementsService = (): Promise<{
  status: number;
  data: {
    movements: Movement[];
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const createMovementService = (
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
    movements: Movement[];
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

export const updateMovementService = (
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
    movements: Movement[];
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

export const deleteMovementService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
