import { Account } from './Account';
import { Category } from './Category';
import { MemberChurch } from './Member';

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
  member_id: string | null;
  member: MemberChurch | null;
  account: Account | null;
  observation?: string | null;
}
