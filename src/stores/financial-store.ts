/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore, storeToRefs } from 'pinia';
import { Notify } from 'quasar';
import {
  getDeliveriesService,
  getMovementsWithObservationsService,
  updateDeliveryService,
} from 'src/services/financial-service';
import { Delivery } from 'src/ts/interfaces/data/Delivery';
import { Movement } from 'src/ts/interfaces/data/Movement';
import { useOrderStore } from './order-store';
import { useEnterpriseStore } from './enterprise-store';

const { hasCounter } = storeToRefs(useOrderStore());
const { enterpriseHeadquarters } = storeToRefs(useEnterpriseStore());

export const useFinancialStore = defineStore('financial', {
  state: () => ({
    filledData: true as boolean,
    loadingDelivery: false as boolean,
    listDelivery: [] as Delivery[],
    orderCount: 0 as number,
    listMovementFinancial: [] as Movement[],
  }),
  actions: {
    clearListFinancial() {
      this.listDelivery.splice(0, this.listDelivery.length);
    },
    clearListMovementFinancial() {
      this.listMovementFinancial.splice(0, this.listMovementFinancial.length);
    },
    setLoading(loading: boolean) {
      this.loadingDelivery = loading;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
    },
    setOrderCount(order: number) {
      this.orderCount = order;
    },
    setListDelivery(deliveries: Delivery[]) {
      deliveries.map((item) => this.listDelivery.push(item));
    },
    setListMovementFinancial(movements: Movement[]) {
      this.listMovementFinancial = movements.sort((a, b) => {
        const dateA = new Date(a.date_movement);
        const dateB = new Date(b.date_movement);
        return dateB.getTime() - dateA.getTime();
      });
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
          this.setOrderCount(response.data.order_count);
          hasCounter.value = response.data.counter;
          enterpriseHeadquarters.value = response.data.is_headquarters;
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getMovementsWithObservations(date: string) {
      this.setLoading(true);
      try {
        this.clearListMovementFinancial();
        const response = await getMovementsWithObservationsService(date);
        if (response.status === 200) {
          this.setListMovementFinancial(response.data.movements);
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
