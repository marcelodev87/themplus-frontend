/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import {
  createMinistryService,
  deleteMinistryService,
  getMinistriesService,
  updateMinistryService,
} from 'src/services/ministry-service';
import { Ministry, DataMinistry } from 'src/ts/interfaces/data/Ministry';

export const useMinistryStore = defineStore('ministry', {
  state: () => ({
    filledData: true as boolean,
    loadingMinistry: false as boolean,
    listMinistry: [] as Ministry[],
  }),
  actions: {
    clearListMinistry() {
      this.listMinistry.splice(0, this.listMinistry.length);
    },
    setListMinistry(ministries: Ministry[]) {
      ministries.map((item) => this.listMinistry.push(item));
    },
    setLoading(loading: boolean) {
      this.loadingMinistry = loading;
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
    async getMinistries() {
      try {
        this.setLoading(true);
        const response = await getMinistriesService();
        if (response.status === 200) {
          this.clearListMinistry();
          this.setListMinistry(response.data.ministries);
          updateNotifications(response.data.notifications);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createMinistry(data: DataMinistry) {
      try {
        this.setLoading(true);
        const response = await createMinistryService(data);
        if (response.status === 201) {
          this.clearListMinistry();
          this.setListMinistry(response.data.ministries);
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
    async updateMinistry(data: DataMinistry) {
      try {
        this.setLoading(true);
        const response = await updateMinistryService(data);
        if (response.status === 200) {
          this.clearListMinistry();
          this.setListMinistry(response.data.ministries);
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
    async deleteMinistry(ministryID: string) {
      this.setLoading(true);
      try {
        const response = await deleteMinistryService(ministryID);
        if (response.status === 200) {
          this.clearListMinistry();
          this.setListMinistry(response.data.ministries);
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
