import { api } from 'boot/axios';
import { CouponEnterprise } from 'src/ts/interfaces/data/Coupon';
import { ISubscriptionInfo } from 'src/ts/interfaces/data/SubscriptionInfo';

const baseUrl = 'resource';

export const getSubscriptionInfoService = (): Promise<{
  status: number;
  data: {
    subscription: ISubscriptionInfo;
  };
}> => api.get(`${baseUrl}/subscription`);

export const getCouponsInEnterpriseService = (): Promise<{
  status: number;
  data: {
    coupons: CouponEnterprise[];
  };
}> => api.get(`/${baseUrl}/coupons`);
