/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { createCategoryService } from 'src/services/category-service';
import { Category } from 'src/ts/interfaces/data/Category';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    loadingCategory: false as boolean,
    listCategory: [] as Category[],
  }),
  actions: {
    clearListCategory() {
      this.listCategory.splice(0, this.listCategory.length);
    },
    setLoading(loading: boolean) {
      this.loadingCategory = loading;
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
    async createCategory(category: string, type: 'Entrada' | 'Saída') {
      this.setLoading(true);
      try {
        const response = await createCategoryService(category, type.toLowerCase());
        if (response.status === 201) {
          this.clearListCategory();
          this.listCategory = response.data.categories;
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
