import { api } from 'boot/axios';
import { Delivery } from 'src/ts/interfaces/data/Delivery';
import { FileFinancial } from 'src/ts/interfaces/data/Financial';
import { Movement } from 'src/ts/interfaces/data/Movement';
import { SettingsCounter } from 'src/ts/interfaces/data/Settings';

const baseUrl = 'financial';

export const getDeliveriesService = (): Promise<{
  status: number;
  data: {
    deliveries: Delivery[];
    filled_data: boolean;
    counter: string | null;
    is_headquarters: boolean;
    order_count: number;
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const getSettingsCounterService = (): Promise<{
  status: number;
  data: {
    settings: SettingsCounter;
  };
}> => api.get(`${baseUrl}/settings-counter`);

export const getMovementsWithObservationsService = (
  date: string
): Promise<{
  status: number;
  data: {
    movements: Movement[];
  };
}> => api.get(`${baseUrl}/movements-observations/${date}`);

export const updateDeliveryService = (
  monthYear: string
): Promise<{
  status: number;
  data: {
    deliveries: Delivery[];
    message: string;
  };
}> => api.post(`${baseUrl}`, { monthYear });

export const updateSettingsCounterService = (
  allowAddUser: number,
  allowEditUser: number,
  allowDeleteUser: number,
  allowEditMovement: number,
  allowDeleteMovement: number
): Promise<{
  status: number;
  data: {
    deliveries: Delivery[];
    filled_data: boolean;
    counter: string | null;
    is_headquarters: boolean;
    order_count: number;
    message: string;
  };
}> =>
  api.put(`${baseUrl}/settings-counter`, {
    allowAddUser,
    allowEditUser,
    allowDeleteUser,
    allowEditMovement,
    allowDeleteMovement,
  });

export const getFileFinancialService = (
  monthYear: string
): Promise<{
  status: number;
  data: {
    files_financial: FileFinancial[];
  };
}> => api.get(`${baseUrl}/file-financial/${monthYear}`);

export const createFileFinancialService = (
  name: string,
  file: File | null,
  monthYear: string
): Promise<{
  status: number;
  data: {
    files_financial: FileFinancial[];
    message: string;
  };
}> => {
  const formData = new FormData();

  formData.append('name', name);

  if (file) {
    formData.append('file', file);
  }

  return api.post(`${baseUrl}/file-financial/${monthYear}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteFileFinancialService = (
  id: string
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/file-financial/${id}`);

export const downloadFileService = async (url: string) => {
  if (url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not OK');
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = '';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download file:', error);
      console.warn('URL do arquivo não disponível');
    }
  } else {
    console.warn('URL do arquivo não disponível');
  }
};
