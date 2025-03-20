/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  getCategoriesService,
  updateAlertService,
} from 'src/services/alert-service';
import { Category } from 'src/ts/interfaces/data/Category';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    loadingAlert: false as boolean,
    listCategory: [] as Category[],
  }),
  actions: {
    clearCategory() {
      this.listCategory.splice(0, this.listCategory.length);
    },
    setLoading(loading: boolean) {
      this.loadingAlert = loading;
    },
    setListCategories(categories: Category[]) {
      categories.map((item) => this.listCategory.push(item));
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
    async getCategories(id: string) {
      this.setLoading(true);
      try {
        this.clearCategory();
        const response = await getCategoriesService(id);
        if (response.status === 200) {
          this.setListCategories(response.data.categories);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateAlert(
      data: { id: string; alert: string | null }[],
      enterpriseId: string
    ) {
      this.setLoading(true);
      try {
        const response = await updateAlertService(data, enterpriseId);
        if (response.status === 200) {
          this.clearCategory();
          this.setListCategories(response.data.categories);
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
  },
});
