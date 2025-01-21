import { api } from 'boot/axios';
import { Delivery } from 'src/ts/interfaces/data/Delivery';
import { Movement } from 'src/ts/interfaces/data/Movement';

const baseUrl = 'financial';

export const getDeliveriesService = (): Promise<{
  status: number;
  data: {
    deliveries: Delivery[];
    filled_data: boolean;
    counter: string | null;
    is_headquarters: boolean;
    order_count: number;
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const getMovementsWithObservationsService = (): Promise<{
  status: number;
  data: {
    movements: Movement[];
  };
}> => api.get(`${baseUrl}/movements-observations`);

export const updateDeliveryService = (
  monthYear: string
): Promise<{
  status: number;
  data: {
    deliveries: Delivery[];
    message: string;
  };
}> => api.post(`${baseUrl}`, { monthYear });
