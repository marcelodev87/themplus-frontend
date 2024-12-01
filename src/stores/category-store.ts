/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { Category } from 'src/ts/interfaces/data/Category';
import {
  createCategoryService,
  getCategoriesService,
  deleteCategoryService,
  updateCategoryService,
  getCategoriesWithParamsService,
  updateActiveCategoryService,
} from 'src/services/category-service';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    filledData: true as boolean,
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
    setFilledData(data: boolean) {
      this.filledData = data;
    },
    setListCategory(categories: Category[]) {
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
    async getCategories() {
      this.setLoading(true);
      try {
        const response = await getCategoriesService();
        if (response.status === 200) {
          this.clearListCategory();
          this.setListCategory(response.data.categories);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createCategory(
      category: string,
      type: 'Entrada' | 'Saída',
      alert: string | null
    ) {
      this.setLoading(true);
      try {
        const response = await createCategoryService(
          category,
          type.toLowerCase(),
          alert
        );
        if (response.status === 201) {
          this.clearListCategory();
          this.setListCategory(response.data.categories);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getCategoriesWithParams(
      createdByMe: boolean,
      defaultSystem: boolean
    ) {
      try {
        this.setLoading(true);
        const response = await getCategoriesWithParamsService(
          createdByMe,
          defaultSystem
        );
        if (response.status === 200) {
          this.clearListCategory();
          this.setListCategory(response.data.categories);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateCategory(
      id: string,
      category: string,
      type: 'Entrada' | 'Saída',
      alert: string | null
    ) {
      this.setLoading(true);
      try {
        const response = await updateCategoryService(
          id,
          category,
          type.toLowerCase(),
          alert
        );
        if (response.status === 200) {
          this.clearListCategory();
          this.setListCategory(response.data.categories);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateActiveCategory(id: string) {
      this.setLoading(true);
      try {
        const response = await updateActiveCategoryService(id);
        if (response.status === 200) {
          this.clearListCategory();
          this.setListCategory(response.data.categories);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteCategory(categoryId: string) {
      this.setLoading(true);
      try {
        const response = await deleteCategoryService(categoryId);
        if (response.status === 200) {
          this.clearListCategory();
          this.setListCategory(response.data.categories);
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
