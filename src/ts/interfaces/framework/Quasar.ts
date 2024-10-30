/* eslint-disable @typescript-eslint/no-explicit-any */
export interface QuasarTable {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: 'center' | 'left' | 'right';
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;
  headerClasses?: string;
}

export interface QuasarSelect<T> {
  label: string;
  value: T;
}
