export interface DataCategory {
  name: string;
  type: 'Entrada' | 'Saída';
}

export interface Category {
  id: string;
  name: string;
  type: string;
  enterprise_id: string;
  alert: string | null;
  active: 1 | 0;
  default: 1 | 0;
  code_debt: number | null;
  code_credit: number | null;
}

export interface CategoryPanel {
  id: string | null;
  name: string;
  type: string;
  organization_name: string;
  code_debt: number | null;
  code_credit: number | null;
}
