/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { Category, CategoryPanel } from 'src/ts/interfaces/data/Category';
import {
  createCategoryService,
  getCategoriesService,
  deleteCategoryService,
  updateCategoryService,
  getCategoriesWithParamsService,
  updateActiveCategoryService,
  getEnterpriseCategoryByCounter,
  updateCategoryCodeService,
} from 'src/services/category-service';
import { updateNotifications } from 'src/composables/NotificationsManage';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    filledData: true as boolean,
    loadingCategory: false as boolean,
    listCategory: [] as Category[],
    listCategoryPanel: [] as CategoryPanel[],
    categoryEdit: {} as Category[],
  }),
  actions: {
    clearListCategory() {
      this.listCategory.splice(0, this.listCategory.length);
    },
    setListCategory(categories: Category[]) {
      categories.map((item) => this.listCategory.push(item));
    },
    clearListCategoryPanel() {
      this.listCategoryPanel.splice(0, this.listCategoryPanel.length);
    },
    setListCategoryPanel(categories: CategoryPanel[]) {
      categories.map((item) => this.listCategoryPanel.push(item));
    },
    // setCategoryEdit(category: Category[]) {
    //   this.categoryEdit.push(category);
    // },
    setLoading(loading: boolean) {
      this.loadingCategory = loading;
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
    async getCategories() {
      this.setLoading(true);
      try {
        const response = await getCategoriesService();
        if (response.status === 200) {
          this.clearListCategory();
          this.setListCategory(response.data.categories);
          updateNotifications(response.data.notifications);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getEnterpriseCategoryByCounter(type: string, classification: string) {
      this.setLoading(true);
      try {
        const response = await getEnterpriseCategoryByCounter(
          type,
          classification
        );
        if (response.status === 200) {
          this.clearListCategoryPanel();
          this.setListCategoryPanel(response.data.categories);
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

        return response;
      } catch (error) {
        this.createError(error);
        return null;
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

        return response;
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async updateCategoryCode(data: {
      id: string | null;
      name: string;
      codeDebt: number | null;
      codeCredit: number | null;
    }) {
      this.setLoading(true);
      try {
        const response = await updateCategoryCodeService(data);
        if (response.status === 200) {
          this.clearListCategoryPanel();
          this.setListCategoryPanel(response.data.categories);
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
