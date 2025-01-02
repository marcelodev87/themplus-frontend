/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  getEnterpriseService,
  searchEnterpriseService,
  updateEnterpriseService,
} from 'src/services/enterprise-service';
import { Enterprise, ResultEnterprise } from '../ts/interfaces/data/Enterprise';

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    loadingEnterprise: false as boolean,
    enterprise: null as Enterprise | null,
    listSearchEnterprise: [] as ResultEnterprise[],
  }),
  getters: {
    resultEnterpriseSelect: (state) => {
      return state.listSearchEnterprise.map((item) => {
        return {
          label: `Nome: ${item.name} | E-mail: ${item.email}`,
          value: item.id,
        };
      });
    },
  },
  actions: {
    setLoading(loading: boolean) {
      this.loadingEnterprise = loading;
    },
    setEnterprise(enterprise: Enterprise) {
      this.enterprise = enterprise;
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
    setResultSearchEnterprise(enterprises: ResultEnterprise[]) {
      enterprises.map((item) => this.listSearchEnterprise.push(item));
    },
    clearResultSearchEnterprise() {
      this.listSearchEnterprise.splice(0, this.listSearchEnterprise.length);
    },
    async getEnterprise() {
      this.setLoading(true);
      try {
        const response = await getEnterpriseService();
        if (response.status === 200) {
          this.setEnterprise(response.data.enterprise);
        }
        return response;
      } catch (error) {
        this.createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async searchEnterprise(text: string) {
      this.setLoading(true);
      try {
        this.clearResultSearchEnterprise();
        const response = await searchEnterpriseService(text);
        if (response.status === 200) {
          this.setResultSearchEnterprise(response.data.enterprises);
          if (this.listSearchEnterprise.length === 0) {
            Notify.create({
              message: 'Nenhum usuário foi encontrado',
              type: 'warning',
            });
          }
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    // async createCategory(category: string, type: 'Entrada' | 'Saída') {
    //   this.setLoading(true);
    //   try {
    //     const response = await createCategoryService(
    //       category,
    //       type.toLowerCase()
    //     );
    //     if (response.status === 201) {
    //       this.clearListCategory();
    //       this.setListCategory(response.data.categories);
    //       this.createSuccess(response.data.message);
    //     }
    //   } catch (error) {
    //     this.createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    async updateEnterprise(payload: {
      id: string;
      name: string;
      cnpj: string | null;
      cpf: string | null;
      cep: string | null;
      state: string | null;
      city: string | null;
      neighborhood: string | null;
      address: string | null;
      complement: string | null;
      number_address: string | null;
      email: string | null;
      phone: string | null;
    }) {
      this.setLoading(true);
      try {
        const response = await updateEnterpriseService(payload);
        if (response.status === 200) {
          this.setEnterprise(response.data.enterprise);
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
    // async deleteCategory(categoryId: string) {
    //   this.setLoading(true);
    //   try {
    //     const response = await deleteCategoryService(categoryId);
    //     if (response.status === 200) {
    //       this.listCategory = this.listCategory.filter(
    //         (item) => item.id !== categoryId
    //       );
    //       this.createSuccess(response.data.message);
    //     }
    //   } catch (error) {
    //     this.createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
  },
});
