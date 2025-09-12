import { api } from 'boot/axios';
import { DataRole, Role } from 'src/ts/interfaces/data/Role';

const baseUrl = 'role';

export const getRolesService = (): Promise<{
  status: number;
  data: {
    roles: Role[];
    filled_data: boolean;
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const createRoleService = (
  data: DataRole
): Promise<{
  status: number;
  data: {
    roles: Role[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateRoleService = (
  data: DataRole
): Promise<{
  status: number;
  data: {
    roles: Role[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, data);

export const deleteRoleService = (
  id: string
): Promise<{
  status: number;
  data: {
    roles: Role[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
