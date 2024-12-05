/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  createSchedulingService,
  deleteSchedulingService,
  exportSchedulingService,
  finalizeSchedulingService,
  getSchedulingInformationsService,
  getSchedulingsService,
  getSchedulingsWithParamsService,
  updateSchedulingService,
} from 'src/services/scheduling-service';

import {
  AccountInformation,
  CategoryInformation,
} from 'src/ts/interfaces/data/InformationsForms';
import { Scheduling } from 'src/ts/interfaces/data/Scheduling';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';

export const useSchedulingStore = defineStore('scheduling', {
  state: () => ({
    filledData: true as boolean,
    loadingScheduling: false as boolean,
    listScheduling: [] as Scheduling[],
    listCategory: [] as QuasarSelect<string>[],
    listAccount: [] as QuasarSelect<string>[],
  }),
  actions: {
    clearListScheduling() {
      this.listScheduling.splice(0, this.listScheduling.length);
    },
    clearCategories() {
      this.listCategory.splice(0, this.listCategory.length);
    },
    clearAccounts() {
      this.listAccount.splice(0, this.listAccount.length);
    },
    setLoading(loading: boolean) {
      this.loadingScheduling = loading;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
    },
    setListScheduling(schedulings: Scheduling[]) {
      schedulings.map((item) => this.listScheduling.push(item));
    },
    setListCategory(categories: CategoryInformation[]) {
      this.listCategory = categories
        .filter((item) => item.active === 1)
        .map((item) => ({ label: item.name, value: item.id }));
    },
    setListAccount(accounts: AccountInformation[]) {
      accounts.map((item) =>
        this.listAccount.push({ label: item.name, value: item.id })
      );
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
    async getSchedulings() {
      try {
        this.setLoading(true);
        const response = await getSchedulingsService();
        if (response.status === 200) {
          this.clearListScheduling();
          this.setListScheduling(response.data.schedulings);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getSchedulingsWithParams(
      expired: boolean,
      entry: boolean,
      out: boolean
    ) {
      try {
        this.setLoading(true);
        const response = await getSchedulingsWithParamsService(
          expired,
          entry,
          out
        );
        if (response.status === 200) {
          this.clearListScheduling();
          this.setListScheduling(response.data.schedulings);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getSchedulingsInformations(type: string) {
      try {
        this.setLoading(true);
        this.clearCategories();
        this.clearAccounts();
        const response = await getSchedulingInformationsService(type);
        if (response.status === 200) {
          this.setListAccount(response.data.accounts);
          this.setListCategory(response.data.categories);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async exportScheduling(entry: boolean, out: boolean, expired: boolean) {
      try {
        this.setLoading(true);
        await exportSchedulingService(entry, out, expired);
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createScheduling(
      type: string,
      value: string,
      date: string,
      description: string | null,
      file: File | null,
      category: string,
      account: string,
      programmed: number
    ) {
      try {
        this.setLoading(true);
        const response = await createSchedulingService(
          type,
          value,
          date,
          description,
          file,
          category,
          account,
          programmed
        );
        if (response.status === 201) {
          this.clearListScheduling();
          this.setListScheduling(response.data.schedulings);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateScheduling(
      id: string,
      type: string,
      value: string,
      date: string,
      description: string | null,
      file: File | null,
      category: string,
      account: string
    ) {
      try {
        this.setLoading(true);
        const response = await updateSchedulingService(
          id,
          type,
          value,
          date,
          description,
          file,
          category,
          account
        );
        if (response.status === 200) {
          this.clearListScheduling();
          this.setListScheduling(response.data.schedulings);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async finalizeScheduling(schedulingId: string) {
      try {
        this.setLoading(true);
        const response = await finalizeSchedulingService(schedulingId);
        if (response.status === 200) {
          this.listScheduling = this.listScheduling.filter(
            (item) => item.id !== schedulingId
          );
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteScheduling(schedulingId: string) {
      try {
        this.setLoading(true);
        const response = await deleteSchedulingService(schedulingId);
        if (response.status === 200) {
          this.listScheduling = this.listScheduling.filter(
            (item) => item.id !== schedulingId
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
