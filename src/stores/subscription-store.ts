/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  ISubscription,
  ICreditCardData,
} from 'src/ts/interfaces/data/Subscription';
import {
  getSubscriptionsService,
  creditCardPaymentService,
  generateQrCodeService,
  updateForFreeSubscriptionService,
} from 'src/services/subscription-service';
import { updateNotifications } from 'src/composables/NotificationsManage';

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    filledData: true as boolean,
    loadingTableSubscription: false as boolean,
    loadingSubscription: false as boolean,
    freeSubscriptionLoading: false as boolean,
    listSubscription: [] as ISubscription[],
  }),
  actions: {
    clearListSubscription() {
      this.listSubscription.splice(0, this.listSubscription.length);
    },
    setListSubscription(subscriptions: ISubscription[]) {
      subscriptions.map((item) => this.listSubscription.push(item));
    },
    setLoading(loading: boolean) {
      this.loadingSubscription = loading;
    },
    setTableLoading(loading: boolean) {
      this.loadingTableSubscription = loading;
    },
    setFreeSubscriptionLoading(loading: boolean) {
      this.freeSubscriptionLoading = loading;
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
    async getSubscriptions() {
      this.setTableLoading(true);
      try {
        const response = await getSubscriptionsService();
        if (response.status === 200) {
          this.clearListSubscription();
          this.setListSubscription(response.data.subscriptions);
          updateNotifications(response.data.notifications);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setTableLoading(false);
      }
    },
    async creditCardPayment(data: ICreditCardData) {
      this.setLoading(true);
      try {
        const response = await creditCardPaymentService(data);
        if (response.status === 200 && response.data.result) {
          updateNotifications(response.data.notifications);
          return response;
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
      return null;
    },
    async generateQrCode(subscriptionID: string) {
      this.setLoading(true);
      try {
        const response = await generateQrCodeService(subscriptionID);
        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
      return null;
    },
    async updateForFreeSubscription(subscriptionID: string) {
      this.setFreeSubscriptionLoading(true);
      try {
        const response = await updateForFreeSubscriptionService(subscriptionID);
        if (response.status === 200) {
          this.createSuccess(
            'Sua assinatura foi atualizada para a assinatura gratuita'
          );
          return response;
        }
        if (response.status === 204) {
          this.createError('A assinatura selecionada não é gratuita');
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setFreeSubscriptionLoading(false);
      }
      return null;
    },
  },
});
