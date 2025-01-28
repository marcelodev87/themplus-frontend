import { api } from 'boot/axios';
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
    filled_data: boolean;
  };
}> => api.post(`${baseUrl}/`, { mode, date, category });
