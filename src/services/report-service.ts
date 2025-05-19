/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'boot/axios';
import { Movement } from 'src/ts/interfaces/data/Movement';
import { Report } from 'src/ts/interfaces/data/Report';
import { SettingsCounter } from 'src/ts/interfaces/data/Settings';
import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import {
  AmountRegister,
  QuantityRegister,
} from 'src/ts/interfaces/data/Dashboard';
import { Enterprise } from '../ts/interfaces/data/Enterprise';

const baseUrl = 'report';

const createError = (error: any) => {
  let message = 'Error';
  if (error instanceof AxiosError) {
    message = error.response?.data?.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  Notify.create({
    message,
    type: 'negative',
  });
};

export const getReportsService = (
  id: string,
  year: string
): Promise<{
  status: number;
  data: {
    dashboard: {
      amount_registers: AmountRegister[];
      quantity_registers: QuantityRegister[];
      list_years: string[];
    };
    client_name: string;
    enterprise_inspected: Enterprise | null;
    reports: Report[];
  };
}> => api.get(`${baseUrl}/${id}?year_graph=${year}`);

export const detailsReportService = (
  id: string
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    permissions: SettingsCounter;
    finalized: boolean;
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

export const updateMovementByCounterService = (
  id: string,
  type: string,
  value: string,
  date: string,
  description: string | null,
  file: File | string | null,
  category: string,
  account: string
): Promise<{
  status: number;
  data: {
    movements: Movement[];
    permissions: SettingsCounter;
    message: string;
  };
}> => {
  const formData = new FormData();

  formData.append('id', id);
  formData.append('type', type);
  formData.append('value', value);
  formData.append('date', date);
  if (description) formData.append('description', description);
  formData.append('category', category);
  formData.append('account', account);

  if (file) {
    formData.append('file', file);
  }

  return api.post(`${baseUrl}/movement/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const downloadReportService = async (reportId: string) => {
  try {
    const response = await api.post(`${baseUrl}/export/${reportId}`, null, {
      responseType: 'blob',
    });
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');

    const url2 = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url2;
    link.setAttribute('download', `report_${timestamp}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};
