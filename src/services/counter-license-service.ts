import { api } from 'boot/axios';
import {
  ICounterSubscriptionUsage,
  ICounterClientLicense,
} from 'src/ts/interfaces/data/Subscription';

const baseUrl = 'subscription-counter';

export const getCounterLicenseUsageService = (): Promise<{
  status: number;
  data: {
    usage: ICounterSubscriptionUsage;
    licenses: ICounterClientLicense[];
    notifications: number;
  };
}> => api.get(`${baseUrl}/usage`);

export const grantCounterLicenseService = (
  clientEnterpriseId: string
): Promise<{
  status: number;
  data: {
    usage: ICounterSubscriptionUsage;
    message: string;
  };
}> => api.post(`${baseUrl}/grant/${clientEnterpriseId}`);

export const revokeCounterLicenseService = (
  clientEnterpriseId: string
): Promise<{
  status: number;
  data: {
    usage: ICounterSubscriptionUsage;
    message: string;
  };
}> => api.delete(`${baseUrl}/revoke/${clientEnterpriseId}`);
