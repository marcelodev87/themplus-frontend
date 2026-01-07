import { api } from 'boot/axios';
import {
  ISubscription,
  ICreditCardData,
  IQrCode,
} from 'src/ts/interfaces/data/Subscription';

const baseUrl = 'subscription';

export const getSubscriptionsService = (): Promise<{
  status: number;
  data: {
    subscriptions: ISubscription[];
    notifications: number;
  };
}> => api.get(`${baseUrl}`);

export const creditCardPaymentService = (
  data: ICreditCardData
): Promise<{
  status: number;
  data: {
    result: boolean;
    notifications: number;
    message: string;
  };
}> => api.post(`${baseUrl}/payment/credit-card`, data);

export const generateQrCodeService = (
  subscriptionID: string
): Promise<{
  status: number;
  data: {
    notifications: number;
    pix: IQrCode;
  };
}> => api.post(`${baseUrl}/payment/pix`, { subscriptionID });

export const updateForFreeSubscriptionService = (
  subscriptionID: string
): Promise<{
  status: number;
  data: {
    notifications: number;
  };
}> => api.post(`${baseUrl}/payment/free`, { subscriptionID });
