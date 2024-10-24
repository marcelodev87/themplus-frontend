import { QuasarSelect } from '../framework/Quasar';

export interface DataTransfer{
  value: number | null;
  date: string | null;
  account_out: QuasarSelect<string> | null;
  account_enter: QuasarSelect<string> | null;
}
