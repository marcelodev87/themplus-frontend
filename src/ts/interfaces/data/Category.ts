import { Alert } from './Alert';

export interface DataCategory {
  name: string;
  type: 'Entrada' | 'Saída';
}

export interface Category {
  id: string;
  name: string;
  type: string;
  enterprise_id: string;
  alert_id: string;
  alert: Alert;
  active: 1 | 0;
}
