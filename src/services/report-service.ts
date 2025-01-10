import { api } from 'boot/axios';
import { Movement } from 'src/ts/interfaces/data/Movement';
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

export const detailsReportService = (
  id: string
): Promise<{
  status: number;
  data: {
    movements: Movement[];
  };
}> => api.get(`${baseUrl}/details/${id}`);

export const finalizeReportCounterService = (
  id: string
): Promise<{
  status: number;
  data: {
    client_name: string;
    reports: Report[];
    message: string;
  };
}> => api.post(`${baseUrl}/finalize/${id}`);

export const undoReportCounterService = (
  id: string
): Promise<{
  status: number;
  data: {
    client_name: string;
    reports: Report[];
    message: string;
  };
}> => api.post(`${baseUrl}/undo/${id}`);

export const reopenByCounterService = (
  id: string
): Promise<{
  status: number;
  data: {
    client_name: string;
    reports: Report[];
    message: string;
  };
}> => api.delete(`${baseUrl}/reopen/${id}`);
