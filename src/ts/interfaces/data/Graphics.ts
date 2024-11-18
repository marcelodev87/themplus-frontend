export interface CategoryDashboard {
  category_id: string;
  name: string;
  type: string;
  value: string;
}

export interface MovementDashboard {
  month_year: string;
  entry_value: number;
  out_value: number;
  balance: number;
}

export interface UsersDashboard {
  amount_users: number;
  amount_admin: number;
  amount_user_common: number;
}

export interface SchedulingDashboard {
  month_year: string;
  entry_value: number;
  out_value: number;
}

export interface AccountDashboard {
  month_year: string;
  accounts: Array<{
    name: string;
    balance: number;
  }>;
}
