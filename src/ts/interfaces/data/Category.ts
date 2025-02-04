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
}
