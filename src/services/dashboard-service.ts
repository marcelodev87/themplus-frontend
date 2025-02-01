/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { Category } from 'src/ts/interfaces/data/Category';
import { DatePeriod } from 'src/ts/interfaces/data/Date';
import {
  AccountDashboard,
  CategoryDashboard,
  MovementDashboard,
  ScheduleDashboard,
  SchedulingDashboard,
  UsersDashboard,
} from 'src/ts/interfaces/data/Graphics';

const baseUrl = 'dashboard';

const createError = (error: any) => {
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
};

export const getDashboardService = (
  mode: string,
  date: string | DatePeriod,
  category: string | null
): Promise<{
  status: number;
  data: {
    months_years: string[];
    categories_movements_dashboard: CategoryDashboard[] | null;
    categories_schedules_dashboard: ScheduleDashboard[] | null;
    categories: Category[];
    movements_dashboard: MovementDashboard | null;
    users_dashboard: UsersDashboard | null;
    schedulings_dashboard: SchedulingDashboard | null;
    accounts_dashboard: AccountDashboard | null;
    notifications: number;
    filled_data: boolean;
  };
}> => api.post(`${baseUrl}/`, { mode, date, category });

export const downloadDashboardService = async (
  mode: string,
  date: DatePeriod | string,
  category: string | null
) => {
  try {
    const response = await api.post(
      `${baseUrl}/export`,
      { mode, date, category },
      {
        responseType: 'blob',
      }
    );
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');

    const url2 = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url2;
    link.setAttribute('download', `dashboard_${timestamp}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};
