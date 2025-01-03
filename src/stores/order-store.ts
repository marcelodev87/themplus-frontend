/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  actionRequestEnterpriseService,
  deleteOrderService,
  getOrdersViewClientService,
  getOrdersViewCounterService,
  sendRequestEnterpriseService,
  updateRequestEnterpriseService,
} from 'src/services/order-service';
import { OrderClient, OrderCounter } from 'src/ts/interfaces/data/Order';

export const useOrderStore = defineStore('order', {
  state: () => ({
    filledData: true as boolean,
    loadingOrder: false as boolean,
    listOrderClient: [] as OrderClient[],
    listOrderCounter: [] as OrderCounter[],
  }),
  actions: {
    clearListOrderClient() {
      this.listOrderClient.splice(0, this.listOrderClient.length);
    },
    clearListOrderCounter() {
      this.listOrderCounter.splice(0, this.listOrderCounter.length);
    },
    setLoading(loading: boolean) {
      this.loadingOrder = loading;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
    },
    setListOrderClient(orders: OrderClient[]) {
      orders.map((item) => this.listOrderClient.push(item));
    },
    setListOrderCounter(orders: OrderCounter[]) {
      orders.map((item) => this.listOrderCounter.push(item));
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
    async getOrdersViewClient() {
      try {
        this.setLoading(true);
        const response = await getOrdersViewClientService();
        if (response.status === 200) {
          this.clearListOrderClient();
          this.setListOrderClient(response.data.orders);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getOrdersViewCounter() {
      try {
        this.setLoading(true);
        const response = await getOrdersViewCounterService();
        if (response.status === 200) {
          this.clearListOrderCounter();
          this.setListOrderCounter(response.data.orders);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async sendRequestEnterprise(
      enterpriseId: string,
      description: string | null
    ) {
      try {
        this.setLoading(true);
        const response = await sendRequestEnterpriseService(
          enterpriseId,
          description
        );
        if (response.status === 201) {
          this.clearListOrderCounter();
          this.setListOrderCounter(response.data.orders);
          this.createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async updateRequestEnterprise(id: string, description: string | null) {
      try {
        this.setLoading(true);
        const response = await updateRequestEnterpriseService(id, description);
        if (response.status === 200) {
          this.clearListOrderCounter();
          this.setListOrderCounter(response.data.orders);
          this.createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async actionRequestEnterprise(id: string, status: 'declined' | 'accepted') {
      try {
        this.setLoading(true);
        const response = await actionRequestEnterpriseService(id, status);
        if (response.status === 200) {
          this.clearListOrderClient();
          this.setListOrderClient(response.data.orders);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteOrder(orderId: string) {
      this.setLoading(true);
      try {
        const response = await deleteOrderService(orderId);
        if (response.status === 200) {
          this.listOrderCounter = this.listOrderCounter.filter(
            (item) => item.id !== orderId
          );
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
