/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'boot/axios';
import { Relationship } from 'src/ts/interfaces/data/Relationship';

const baseUrl = 'relationship';

export const getRelationshipsService = (): Promise<{
  status: number;
  data: {
    relationships: Relationship[];
  };
}> => api.get(`${baseUrl}`);

export const createRelationshipService = (
  name: string
): Promise<{
  status: number;
  data: {
    relationships: Relationship[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, { name });

export const updateRelationshipService = (
  id: string,
  name: string
): Promise<{
  status: number;
  data: {
    relationships: Relationship[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
  });

export const deleteRelationshipService = (
  id: string
): Promise<{
  status: number;
  data: {
    relationships: Relationship[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
