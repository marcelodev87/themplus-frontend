/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { getDashboardService } from 'src/services/dashboard-service';
import {
  AccountDashboard,
  CategoryDashboard,
  MovementDashboard,
  SchedulingDashboard,
  UsersDashboard,
} from 'src/ts/interfaces/data/Graphics';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loadingDashboard: false as boolean,
    listMonthYear: [] as string[],
    listCategoryDashboard: null as CategoryDashboard[] | null,
    movementsDashboard: null as MovementDashboard | null,
    usersDashboard: null as UsersDashboard | null,
    schedulingsDashboard: null as SchedulingDashboard | null,
    accountsDashboard: null as AccountDashboard | null,
  }),
  actions: {
    clearListMonthYear() {
      this.listMonthYear.splice(0, this.listMonthYear.length);
    },
    setListMonthYear(data: string[]) {
      this.listMonthYear = data;
    },
    setListCategoryDashboard(data: CategoryDashboard[] | null) {
      this.listCategoryDashboard = data;
    },
    setMovementsDashboard(data: MovementDashboard | null) {
      this.movementsDashboard = data;
    },
    setUsersDashboard(data: UsersDashboard | null) {
      this.usersDashboard = data;
    },
    setSchedulingsDashboard(data: SchedulingDashboard | null) {
      this.schedulingsDashboard = data;
    },
    setAccountsDashboard(data: AccountDashboard | null) {
      this.accountsDashboard = data;
    },
    setLoading(loading: boolean) {
      this.loadingDashboard = loading;
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
    async getDashboard() {
      this.setLoading(true);
      try {
        const response = await getDashboardService();
        this.setListCategoryDashboard(null);
        this.setListMonthYear([]);
        this.setMovementsDashboard(null);
        this.setSchedulingsDashboard(null);
        this.setUsersDashboard(null);
        this.setAccountsDashboard(null);
        if (response.status === 200) {
          this.setListCategoryDashboard(response.data.categories_dashboard);
          this.setListMonthYear(response.data.months_years);
          this.setMovementsDashboard(response.data.movements_dashboard);
          this.setSchedulingsDashboard(response.data.schedulings_dashboard);
          this.setUsersDashboard(response.data.users_dashboard);
          this.setAccountsDashboard(response.data.accounts_dashboard);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
