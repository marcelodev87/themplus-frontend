import { Account } from './Account';
import { Category } from './Category';

export interface Movement {
  id: string;
  type: string;
  value: number;
  date_movement: string;
  description: string;
  receipt: string;
  category_id: string;
  account_id: string;
  account: Account | null;
  category: Category | null;
}
