/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import {
  deleteMovementsAnalyzeService,
  finalizeMovementAnalyzeService,
  getMovementsAnalyzeService,
} from 'src/services/movement-analyze-service';
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
import {
  InsertMovementData,
  Movement,
  MovementAnalyze,
} from 'src/ts/interfaces/data/Movement';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';

export const useMovementStore = defineStore('movement', {
  state: () => ({
    filledData: true as boolean,
    loadingMovement: false as boolean,
    listMonthYear: [] as string[],
    listMovement: [] as Movement[],
    listMovementAnalyze: [] as MovementAnalyze[],
    listCategory: [] as QuasarSelect<string>[],
    listAccount: [] as QuasarSelect<string>[],
    listCategoryAll: [] as CategoryInformation[],
    movementsAnalyze: 0 as number,
    delivered: false as boolean,
    listCategoryFilters: [] as QuasarSelect<string>[],
    listAccountFilters: [] as QuasarSelect<string>[],
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
    clearListMovementAnalyze() {
      this.listMovementAnalyze.splice(0, this.listMovementAnalyze.length);
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
    setMovementsAnalyze(data: number) {
      this.movementsAnalyze = data;
    },
    setListMovementsAnalyze(movements: MovementAnalyze[]) {
      movements.map((item) => this.listMovementAnalyze.push(item));
    },
    setListCategoryFilters(data: QuasarSelect<string>[]) {
      this.listCategoryFilters = data;
    },
    setListAccountFilters(data: QuasarSelect<string>[]) {
      this.listAccountFilters = data;
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
        const response = await getMovementsService(date);
        if (response.status === 200) {
          this.clearListMovement();
          this.clearListMonthYear();
          this.clearListCategoryFilters();
          this.setListMovement(response.data.movements);
          this.setListMonthYear(response.data.months_years);
          this.setFilledData(response.data.filled_data);
          this.setDelivered(response.data.delivered);
          this.setListCategoryFilters(response.data.categories);
          this.setListAccountFilters(response.data.accounts);
          this.setMovementsAnalyze(response.data.movements_analyze);
          updateNotifications(response.data.notifications);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getMovementsAnalyze() {
      try {
        this.setLoading(true);
        const response = await getMovementsAnalyzeService();
        if (response.status === 200) {
          this.clearListMovementAnalyze();
          this.setListMovementsAnalyze(response.data.movements_analyze);
          this.setListAccount(response.data.accounts);
          this.setListCategoryAll(response.data.categories);
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
      category: string | null,
      account: string | null
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
          category,
          account
        );
        if (response.status === 200) {
          this.setListMonthYear(response.data.months_years);
          this.setListMovement(response.data.movements);
          this.setDelivered(response.data.delivered);
          this.setListCategoryFilters(response.data.categories);
          this.setListAccountFilters(response.data.accounts);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getMovementInformations(
      type: string | null,
      enterpriseId: string | null
    ) {
      this.setLoading(true);
      try {
        this.clearCategories();
        this.clearCategoriesAll();
        this.clearAccounts();
        const response = await getMovementInformationsService(
          type,
          enterpriseId
        );
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
      programmed: number,
      member: string | null
    ) {
      this.setLoading(true);

      console.log('member', member);
      try {
        const response = await createMovementService(
          type,
          value,
          date,
          description,
          file,
          category,
          account,
          programmed,
          member
        );
        if (response.status === 201) {
          this.clearListMovement();
          this.setListMonthYear(response.data.months_years);
          this.setListMovement(response.data.movements);
          this.setListCategoryFilters(response.data.categories);
          this.setListAccountFilters(response.data.accounts);
          this.setDelivered(response.data.delivered);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async finalizeMovementAnalyze(
      id: string,
      account: string,
      category: string,
      dateMovement: string,
      description: string | null,
      enterpriseId: string,
      receipt: File | null,
      type: string,
      value: string
    ) {
      this.setLoading(true);
      try {
        const response = await finalizeMovementAnalyzeService(
          id,
          account,
          category,
          dateMovement,
          description,
          enterpriseId,
          receipt,
          type,
          value
        );
        if (response.status === 201) {
          this.clearListMovementAnalyze();
          this.setListMovementsAnalyze(response.data.movements_analyze);
          this.setListAccount(response.data.accounts);
          this.setListCategoryAll(response.data.categories);
          this.setMovementsAnalyze(response.data.movements_analyze.length);
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
    async insertMovement(movements: InsertMovementData[]) {
      this.setLoading(true);
      try {
        const response = await insertMovementService(movements);
        if (response.status === 201) {
          this.clearListMovement();
          this.clearListCategoryFilters();
          this.setListMonthYear(response.data.months_years);
          this.setListMovement(response.data.movements);
          this.setDelivered(response.data.delivered);
          this.setListCategoryFilters(response.data.categories);
          this.setListAccountFilters(response.data.accounts);
          updateNotifications(response.data.notifications);
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
      account: string,
      member: string | null
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
          account,
          member
        );
        if (response.status === 200) {
          this.clearListMovement();
          this.setListMonthYear(response.data.months_years);
          this.setListMovement(response.data.movements);
          this.setListCategoryFilters(response.data.categories);
          this.setListAccountFilters(response.data.accounts);
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
    async deleteMovementsAnalyze(id: string) {
      this.setLoading(true);
      try {
        const response = await deleteMovementsAnalyzeService(id);
        if (response.status === 200) {
          this.listMovementAnalyze = this.listMovementAnalyze.filter(
            (item) => item.id !== id
          );
          this.setMovementsAnalyze(this.listMovementAnalyze.length);
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
