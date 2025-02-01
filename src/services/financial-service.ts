import { api } from 'boot/axios';
import { Delivery } from 'src/ts/interfaces/data/Delivery';
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
