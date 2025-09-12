/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import {
  createCongregationService,
  deleteCongregationService,
  getCongregationsService,
  updateCongregationService,
} from 'src/services/congregation-service';
import {
  Congregation,
  DataCongregation,
} from 'src/ts/interfaces/data/Congregation';

export const useCongregationStore = defineStore('congregation', {
  state: () => ({
    filledData: true as boolean,
    loadingCongregation: false as boolean,
    listCongregation: [] as Congregation[],
  }),
  actions: {
    clearListCongregation() {
      this.listCongregation.splice(0, this.listCongregation.length);
    },
    setListCongregation(congregations: Congregation[]) {
      congregations.map((item) => this.listCongregation.push(item));
    },
    setLoading(loading: boolean) {
      this.loadingCongregation = loading;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
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
    async getCongregations() {
      try {
        this.setLoading(true);
        const response = await getCongregationsService();
        if (response.status === 200) {
          this.clearListCongregation();
          this.setListCongregation(response.data.congregations);
          updateNotifications(response.data.notifications);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createCongregation(data: DataCongregation) {
      try {
        this.setLoading(true);
        const response = await createCongregationService(data);
        if (response.status === 201) {
          this.clearListCongregation();
          this.setListCongregation(response.data.congregations);
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
    async updateCongregation(data: DataCongregation) {
      try {
        this.setLoading(true);
        const response = await updateCongregationService(data);
        if (response.status === 200) {
          this.clearListCongregation();
          this.setListCongregation(response.data.congregations);
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
    async deleteCongregation(congregationID: string) {
      try {
        this.setLoading(true);
        const response = await deleteCongregationService(congregationID);
        if (response.status === 200) {
          this.clearListCongregation();
          this.setListCongregation(response.data.congregations);
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
