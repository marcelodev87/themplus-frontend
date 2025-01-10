import { api } from 'boot/axios';
import { Report } from 'src/ts/interfaces/data/Report';

const baseUrl = 'report';

export const getReportsService = (
  id: string
): Promise<{
  status: number;
  data: {
    client_name: string;
    reports: Report[];
  };
}> => api.get(`${baseUrl}/${id}`);

export const finalizeReportCounterService = (
  id: string
): Promise<{
  status: number;
  data: {
    client_name: string;
    reports: Report[];
  };
}> => api.post(`${baseUrl}/finalize/${id}`);

export const undoReportCounterService = (
  id: string
): Promise<{
  status: number;
  data: {
    client_name: string;
    reports: Report[];
  };
}> => api.post(`${baseUrl}/undo/${id}`);

export const reopenByCounterService = (
  id: string
): Promise<{
  status: number;
  data: {
    client_name: string;
    reports: Report[];
  };
}> => api.delete(`${baseUrl}/${id}`);
