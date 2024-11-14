export interface Scheduling {
  id: string;
  date_movement: string;
  enterprise_id: string;
  type: string;
  status: number;
  value: string;
  description: string | null;
  receipt: string | null;
  category_id: string;
  account_id: string;
}
