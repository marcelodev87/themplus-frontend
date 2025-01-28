/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { getDashboardService } from 'src/services/dashboard-service';
import { Category } from 'src/ts/interfaces/data/Category';
import { DatePeriod } from 'src/ts/interfaces/data/Date';
import {
  AccountDashboard,
  CategoryDashboard,
  MovementDashboard,
  SchedulingDashboard,
  UsersDashboard,
} from 'src/ts/interfaces/data/Graphics';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    filledData: true as boolean,
    loadingDashboard: false as boolean,
    listMonthYear: [] as string[],
    listCategoryDashboard: null as CategoryDashboard[] | null,
    listCategoryFilters: [] as Category[],
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
      this.listMonthYear = data.sort((a, b) => {
        const [monthA, yearA] = a.split('/').map(Number);
        const [monthB, yearB] = b.split('/').map(Number);

        if (yearA === yearB) {
          return monthA - monthB;
        }
        return yearA - yearB;
      });
    },
    setListCategoryDashboard(data: CategoryDashboard[] | null) {
      this.listCategoryDashboard = data;
    },
    setMovementsDashboard(data: MovementDashboard | null) {
      this.movementsDashboard = data;
    },
    setListCategoryFilters(data: Category[]) {
      this.listCategoryFilters = data;
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
    async getDashboard(
      mode: string,
      date: DatePeriod | string,
      category: string | null
    ) {
      this.setLoading(true);
      try {
        const response = await getDashboardService(mode, date, category);
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
          this.setListCategoryFilters(response.data.categories);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
