import { api } from 'boot/axios';
import { Cell, DataCell } from 'src/ts/interfaces/data/Cell';

const baseUrl = 'cell';

export const getCellsService = (): Promise<{
  status: number;
  data: {
    cells: Cell[];
    filled_data: boolean;
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const createCellService = (
  data: DataCell
): Promise<{
  status: number;
  data: {
    cells: Cell[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateCellService = (
  data: DataCell
): Promise<{
  status: number;
  data: {
    cells: Cell[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, data);

export const deleteCellService = (
  id: string
): Promise<{
  status: number;
  data: {
    cells: Cell[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
