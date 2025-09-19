import { Congregation } from './Congregation';
import { MemberChurch } from './Member';

export interface Network {
  id: string;
  name: string;
  member_id: string | null;
  member: MemberChurch | null;
  congregation_id: string | null;
  congregation: Congregation | null;
  enterprise_id: string;
}

export interface DataNetwork {
  id?: string | null;
  name: string;
  memberID: string | null;
  congregationID: string | null;
}
