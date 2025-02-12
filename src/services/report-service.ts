import { api } from 'boot/axios';
import { Movement } from 'src/ts/interfaces/data/Movement';
import { Report } from 'src/ts/interfaces/data/Report';
import { SettingsCounter } from 'src/ts/interfaces/data/Settings';
import { Enterprise } from '../ts/interfaces/data/Enterprise';

const baseUrl = 'report';

export const getReportsService = (
  id: string
): Promise<{
  status: number;
  data: {
    client_name: string;
    enterprise_inspected: Enterprise | null;
    reports: Report[];
  };
}> => api.get(`${baseUrl}/${id}`);

export const detailsReportService = (
  id: string
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    permissions: SettingsCounter;
  };
}> => api.get(`${baseUrl}/details/${id}`);
export const excludeMovementService = (
  id: string
): Promise<{
  status: number;
  data: {
    permissions: SettingsCounter;
    message: string;
  };
}> => api.delete(`${baseUrl}/movement/${id}`);

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
