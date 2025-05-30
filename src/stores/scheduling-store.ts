/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import {
  createSchedulingService,
  deleteSchedulingService,
  finalizeSchedulingService,
  getSchedulingInformationsService,
  getSchedulingsService,
  getSchedulingsWithParamsService,
  updateSchedulingService,
  exportSchedulingExcelService,
  exportSchedulingPDFService,
  downloadFileService,
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
    listMonthYear: [] as string[],
    loadingScheduling: false as boolean,
    listScheduling: [] as Scheduling[],
    listCategory: [] as QuasarSelect<string>[],
    listAccount: [] as QuasarSelect<string>[],
    listCategoryFilters: [] as QuasarSelect<string>[],
    listAccountFilters: [] as QuasarSelect<string>[],
    listCategoryAll: [] as CategoryInformation[],
  }),
  actions: {
    clearListMonthYear() {
      this.listMonthYear.splice(0, this.listMonthYear.length);
    },
    setListMonthYear(data: string[]) {
      this.listMonthYear = data.sort((a, b) => {
        const [monthA, yearA] = a.split('/').map(Number);
        const [monthB, yearB] = b.split('/').map(Number);

        if (yearA === yearB) {
          return monthA - monthB;
        }
        return yearA - yearB;
      });
    },
    clearListScheduling() {
      this.listScheduling.splice(0, this.listScheduling.length);
    },
    clearListCategoryFilters() {
      this.listCategoryFilters.splice(0, this.listCategoryFilters.length);
    },
    clearListAccountFilters() {
      this.listAccountFilters.splice(0, this.listAccountFilters.length);
    },
    clearCategories() {
      this.listCategory.splice(0, this.listCategory.length);
    },
    clearCategoriesAll() {
      this.listCategoryAll.splice(0, this.listCategoryAll.length);
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
      this.listScheduling = schedulings.sort((a, b) => {
        const dateA = new Date(a.date_movement);
        const dateB = new Date(b.date_movement);
        return dateB.getTime() - dateA.getTime();
      });
    },
    setListCategoryAll(categories: CategoryInformation[]) {
      this.listCategoryAll = categories
        .filter((item) => item.active === 1)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    setListCategoryFilters(data: QuasarSelect<string>[]) {
      this.listCategoryFilters = data;
    },
    setListAccountFilters(data: QuasarSelect<string>[]) {
      this.listAccountFilters = data;
    },
    setListCategory(categories: CategoryInformation[]) {
      this.listCategory = categories
        .filter((item) => item.active === 1)
        .map((item) => ({ label: item.name, value: item.id }))
        .sort((a, b) => a.label.localeCompare(b.label));
    },
    setListAccount(accounts: AccountInformation[]) {
      this.listAccount = accounts
        .map((item) => ({
          label: `${item.name} ${item.account_number && item.agency_number ? ` | Nº C: ${item.account_number} | Ag: ${item.agency_number}` : ''} `,
          value: item.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
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
    async downloadFile(file: string) {
      try {
        this.setLoading(true);
        await downloadFileService(file);
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getSchedulings(date: string) {
      try {
        this.setLoading(true);
        this.clearListScheduling();
        this.clearListCategoryFilters();
        this.clearListAccountFilters();
        this.clearListMonthYear();
        const response = await getSchedulingsService(date);
        if (response.status === 200) {
          this.setListScheduling(response.data.schedulings);
          this.setListMonthYear(response.data.months_years);
          this.setListCategoryFilters(response.data.categories);
          this.setListAccountFilters(response.data.accounts);
          updateNotifications(response.data.notifications);
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
      out: boolean,
      date: string,
      category: string | null,
      account: string | null
    ) {
      try {
        this.setLoading(true);
        this.clearListScheduling();
        this.clearListCategoryFilters();
        this.clearListAccountFilters();
        const response = await getSchedulingsWithParamsService(
          expired,
          entry,
          out,
          date,
          category,
          account
        );
        if (response.status === 200) {
          this.setListCategoryFilters(response.data.categories);
          this.setListAccountFilters(response.data.accounts);
          this.setListScheduling(response.data.schedulings);
          this.setListMonthYear(response.data.months_years);
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
        this.clearCategoriesAll();
        this.clearAccounts();
        const response = await getSchedulingInformationsService(type);
        if (response.status === 200) {
          this.setListAccount(response.data.accounts);
          this.setListCategory(response.data.categories);
          this.setListCategoryAll(response.data.categories);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async exportSchedulingExcel(
      entry: boolean,
      out: boolean,
      expired: boolean,
      date: string,
      categoryId: string | null
    ) {
      try {
        this.setLoading(true);
        await exportSchedulingExcelService(
          entry,
          out,
          expired,
          date,
          categoryId
        );
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async exportSchedulingPDF(
      entry: boolean,
      out: boolean,
      expired: boolean,
      date: string,
      categoryId: string | null
    ) {
      try {
        this.setLoading(true);
        await exportSchedulingPDFService(entry, out, expired, date, categoryId);
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
        this.clearListCategoryFilters();
        this.clearListAccountFilters();
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
          this.setListMonthYear(response.data.months_years);
          this.setListCategoryFilters(response.data.categories);
          this.setListAccountFilters(response.data.accounts);
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
      file: File | string | null,
      category: string,
      account: string
    ) {
      try {
        this.setLoading(true);
        this.clearListCategoryFilters();
        this.clearListAccountFilters();
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
          this.setListMonthYear(response.data.months_years);
          this.setListCategoryFilters(response.data.categories);
          this.setListAccountFilters(response.data.accounts);
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
