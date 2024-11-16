/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  createAlertService,
  deleteAlertService,
  getAlertsService,
  updateAlertService,
} from 'src/services/alert-service';
import { Alert } from 'src/ts/interfaces/data/Alert';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    loadingAlert: false as boolean,
    listAlert: [] as Alert[],
    loading: false as boolean,
  }),
  actions: {
    clearListAlert() {
      this.listAlert.splice(0, this.listAlert.length);
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setListAlert(alerts: Alert[]) {
      alerts.map((item) => this.listAlert.push(item));
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
    async getAlerts() {
      this.setLoading(true);
      try {
        const response = await getAlertsService();
        if (response.status === 200) {
          this.clearListAlert();
          this.setListAlert(response.data.alerts);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createAlert(description: string | null) {
      this.setLoading(true);
      try {
        const response = await createAlertService(description);
        if (response.status === 201) {
          this.clearListAlert();
          this.setListAlert(response.data.alerts);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateCategory(id: string, description: string | null) {
      this.setLoading(true);
      try {
        const response = await updateAlertService(id, description ?? null);
        if (response.status === 200) {
          this.clearListAlert();
          this.setListAlert(response.data.alerts);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteAlert(alertId: string) {
      this.setLoading(true);
      try {
        const response = await deleteAlertService(alertId);
        if (response.status === 200) {
          this.listAlert = this.listAlert.filter((item) => item.id !== alertId);
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
