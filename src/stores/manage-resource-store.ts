/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  getCouponsInEnterpriseService,
  getSubscriptionInfoService,
} from 'src/services/manage-resource-service';

export const useManageResourceStore = defineStore('manage-resource', {
  state: () => ({
    loadingResource: false as boolean,
  }),
  actions: {
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
    setLoading(loading: boolean) {
      this.loadingResource = loading;
    },
    async getSubscriptionInfo() {
      this.setLoading(true);
      try {
        return await getSubscriptionInfoService();
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async getCouponsInEnterprise() {
      this.setLoading(true);
      try {
        return await getCouponsInEnterpriseService();
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
