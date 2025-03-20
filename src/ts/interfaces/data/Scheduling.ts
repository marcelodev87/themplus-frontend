import { Account } from './Account';
import { Category } from './Category';

export interface Scheduling {
  id: string;
  date_movement: string;
  enterprise_id: string;
  type: string;
  value: string;
  description: string | null;
  receipt: string | null;
  category_id: string;
  account_id: string;
  category: Category | null;
  account: Account | null;
  observation?: string | null;
}
