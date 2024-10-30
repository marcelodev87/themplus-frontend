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
} from 'src/services/category-service';

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
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createCategory(category: string, type: 'Entrada' | 'Saída') {
      this.setLoading(true);
      try {
        const response = await createCategoryService(
          category,
          type.toLowerCase()
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
    async updateCategory(
      id: string,
      category: string,
      type: 'Entrada' | 'Saída'
    ) {
      this.setLoading(true);
      try {
        const response = await updateCategoryService(
          id,
          category,
          type.toLowerCase()
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
    async deleteCategory(categoryId: string) {
      this.setLoading(true);
      try {
        const response = await deleteCategoryService(categoryId);
        if (response.status === 200) {
          this.listCategory = this.listCategory.filter(
            (item) => item.id !== categoryId
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
