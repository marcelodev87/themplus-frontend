export interface CategoryUpdate {
  id: string;
  name: string;
  type: string;
  enterprise_id: string;
  default: 1 | 0;
  code_debt: number | null;
  code_credit: number | null;
}
