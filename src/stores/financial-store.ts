/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  getDeliveriesService,
  updateDeliveryService,
} from 'src/services/financial-service';
import { Delivery } from 'src/ts/interfaces/data/Delivery';

export const useFinancialStore = defineStore('financial', {
  state: () => ({
    filledData: false as boolean,
    loadingDelivery: false as boolean,
    listDelivery: [] as Delivery[],
  }),
  actions: {
    clearListFinancial() {
      this.listDelivery.splice(0, this.listDelivery.length);
    },
    setLoading(loading: boolean) {
      this.loadingDelivery = loading;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
    },
    setListDelivery(deliveries: Delivery[]) {
      deliveries.map((item) => this.listDelivery.push(item));
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
    async getDelivery() {
      this.setLoading(true);
      try {
        const response = await getDeliveriesService();
        if (response.status === 200) {
          this.clearListFinancial();
          this.setListDelivery(response.data.deliveries);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateDelivery(monthYear: string) {
      this.setLoading(true);
      try {
        const response = await updateDeliveryService(monthYear);
        if (response.status === 200) {
          this.clearListFinancial();
          this.setListDelivery(response.data.deliveries);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
