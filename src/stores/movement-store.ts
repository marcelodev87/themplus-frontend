/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import {
  createMovementService,
  deleteMovementService,
  downloadFileService,
  exportMovementExcelService,
  exportMovementInsertExampleService,
  exportMovementPDFService,
  getMovementInformationsService,
  getMovementsService,
  getMovementsWithParamsService,
  insertMovementService,
  saveObservationsService,
  updateMovementService,
} from 'src/services/movement-service';
import {
  AccountInformation,
  CategoryInformation,
} from 'src/ts/interfaces/data/InformationsForms';
import { InsertMovementData, Movement } from 'src/ts/interfaces/data/Movement';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';

export const useMovementStore = defineStore('movement', {
  state: () => ({
    filledData: true as boolean,
    loadingMovement: false as boolean,
    listMonthYear: [] as string[],
    listMovement: [] as Movement[],
    listCategory: [] as QuasarSelect<string>[],
    listAccount: [] as QuasarSelect<string>[],
    listCategoryAll: [] as CategoryInformation[],
    delivered: false as boolean,
    listCategoryFilters: [] as QuasarSelect<string>[],
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
    clearListMovement() {
      this.listMovement.splice(0, this.listMovement.length);
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
    clearListCategoryFilters() {
      this.listCategoryFilters.splice(0, this.listCategoryFilters.length);
    },
    setLoading(loading: boolean) {
      this.loadingMovement = loading;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
    },
    setDelivered(data: boolean) {
      this.delivered = data;
    },
    setListCategoryFilters(data: QuasarSelect<string>[]) {
      this.listCategoryFilters = data;
    },
    setListMovement(movements: Movement[]) {
      this.listMovement = movements.sort((a, b) => {
        const dateA = new Date(a.date_movement);
        const dateB = new Date(b.date_movement);
        return dateB.getTime() - dateA.getTime();
      });
    },
    setListCategory(categories: CategoryInformation[]) {
      this.listCategory = categories
        .filter((item) => item.active === 1)
        .map((item) => ({ label: item.name, value: item.id }))
        .sort((a, b) => a.label.localeCompare(b.label));
    },
    setListCategoryAll(categories: CategoryInformation[]) {
      this.listCategoryAll = categories
        .filter((item) => item.active === 1)
        .sort((a, b) => a.name.localeCompare(b.name));
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
    async getMovements(date: string) {
      try {
        this.setLoading(true);
        this.clearListMovement();
        this.clearListMonthYear();
        this.clearListCategoryFilters();
        const response = await getMovementsService(date);
        if (response.status === 200) {
          this.setListMovement(response.data.movements);
          this.setListMonthYear(response.data.months_years);
          this.setFilledData(response.data.filled_data);
          this.setDelivered(response.data.delivered);
          this.setListCategoryFilters(response.data.categories);
          updateNotifications(response.data.notifications);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getMovementsWithParams(
      entry: boolean,
      out: boolean,
      date: string,
      category: string | null
    ) {
      try {
        this.setLoading(true);
        this.clearListMovement();
        this.clearListMonthYear();
        this.clearListCategoryFilters();
        const response = await getMovementsWithParamsService(
          entry,
          out,
          date,
          category
        );
        if (response.status === 200) {
          this.setListMonthYear(response.data.months_years);
          this.setListMovement(response.data.movements);
          this.setDelivered(response.data.delivered);
          this.setListCategoryFilters(response.data.categories);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getMovementInformations(type: string | null) {
      this.setLoading(true);
      try {
        this.clearCategories();
        this.clearCategoriesAll();
        this.clearAccounts();
        const response = await getMovementInformationsService(type);
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
    async exportMovementExcel(
      entry: boolean,
      out: boolean,
      date: string,
      categoryId: string | null
    ) {
      try {
        this.setLoading(true);
        await exportMovementExcelService(entry, out, date, categoryId);
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async exportMovementPDF(
      entry: boolean,
      out: boolean,
      date: string,
      categoryId: string | null
    ) {
      try {
        this.setLoading(true);
        await exportMovementPDFService(entry, out, date, categoryId);
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async exportMovementInsertExample() {
      try {
        this.setLoading(true);
        await exportMovementInsertExampleService();
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
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
    async createMovement(
      type: string,
      value: string,
      date: string,
      description: string | null,
      file: File | null,
      category: string,
      account: string,
      programmed: number
    ) {
      this.setLoading(true);
      try {
        const response = await createMovementService(
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
          this.clearListMovement();
          this.setListMonthYear(response.data.months_years);
          this.setListMovement(response.data.movements);
          this.setDelivered(response.data.delivered);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async insertMovement(movements: InsertMovementData[]) {
      this.setLoading(true);
      try {
        const response = await insertMovementService(movements);
        if (response.status === 201) {
          this.clearListMovement();
          this.setListMonthYear(response.data.months_years);
          this.setListMovement(response.data.movements);
          this.setDelivered(response.data.delivered);
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
    async updateMovement(
      id: string,
      type: string,
      value: string,
      date: string,
      description: string | null,
      file: File | string | null,
      category: string,
      account: string
    ) {
      this.setLoading(true);
      try {
        const response = await updateMovementService(
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
          this.clearListMovement();
          this.setListMonthYear(response.data.months_years);
          this.setListMovement(response.data.movements);
          this.setDelivered(response.data.delivered);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async saveObservations(data: { id: string; observation: string | null }[]) {
      this.setLoading(true);
      try {
        const response = await saveObservationsService(data);
        if (response.status === 200) {
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
    async deleteMovement(movementId: string) {
      this.setLoading(true);
      try {
        const response = await deleteMovementService(movementId);
        if (response.status === 200) {
          this.listMovement = this.listMovement.filter(
            (item) => item.id !== movementId
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
