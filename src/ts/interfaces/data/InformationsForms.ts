export interface CategoryInformation {
  id: string;
  name: string;
  active: 1 | 0;
  type: string;
  alert: string | null;
}

export interface AccountInformation {
  id: string;
  name: string;
  account_number: string;
  agency_number: string;
}
