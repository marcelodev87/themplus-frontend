import { api } from 'boot/axios';
import {
  AccountDashboard,
  CategoryDashboard,
  MovementDashboard,
  SchedulingDashboard,
  UsersDashboard,
} from 'src/ts/interfaces/data/Graphics';

const baseUrl = 'dashboard';

export const getDashboardService = (): Promise<{
  status: number;
  data: {
    months_years: string[];
    categories_dashboard: CategoryDashboard | null;
    movements_dashboard: MovementDashboard | null;
    users_dashboard: UsersDashboard | null;
    schedulings_dashboard: SchedulingDashboard | null;
    accounts_dashboard: AccountDashboard | null;
  };
}> => api.get(`${baseUrl}`);
