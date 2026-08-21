/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  ICounterSubscriptionUsage,
  ICounterClientLicense,
} from 'src/ts/interfaces/data/Subscription';
import {
  getCounterLicenseUsageService,
  grantCounterLicenseService,
  revokeCounterLicenseService,
} from 'src/services/counter-license-service';
import { updateNotifications } from 'src/composables/NotificationsManage';

export const useCounterLicenseStore = defineStore('counterLicense', {
  state: () => ({
    loadingCounterLicense: false as boolean,
    usage: null as ICounterSubscriptionUsage | null,
    listCounterLicense: [] as ICounterClientLicense[],
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingCounterLicense = loading;
    },
    setUsage(usage: ICounterSubscriptionUsage) {
      this.usage = usage;
    },
    setListCounterLicense(licenses: ICounterClientLicense[]) {
      this.listCounterLicense = licenses;
    },
    createError(error: any) {
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
    },
    createSuccess(message: string) {
      Notify.create({
        message,
        type: 'positive',
      });
    },
    async getCounterLicenseUsage() {
      this.setLoading(true);
      try {
        const response = await getCounterLicenseUsageService();
        if (response.status === 200) {
          this.setUsage(response.data.usage);
          this.setListCounterLicense(response.data.licenses);
          updateNotifications(response.data.notifications);
        }
        return response;
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async grantCounterLicense(clientEnterpriseId: string) {
      this.setLoading(true);
      try {
        const response = await grantCounterLicenseService(clientEnterpriseId);
        if (response.status === 201) {
          this.createSuccess(response.data.message);
          this.setUsage(response.data.usage);
          await this.getCounterLicenseUsage();
        }
        return response;
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async revokeCounterLicense(clientEnterpriseId: string) {
      this.setLoading(true);
      try {
        const response = await revokeCounterLicenseService(clientEnterpriseId);
        if (response.status === 200) {
          this.createSuccess(response.data.message);
          this.setUsage(response.data.usage);
          await this.getCounterLicenseUsage();
        }
        return response;
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
