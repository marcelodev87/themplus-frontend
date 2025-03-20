import { QuasarSelect } from '../framework/Quasar';

export interface DataTransfer {
  value: string;
  date: string | null;
  account_out: QuasarSelect<string> | null;
  account_enter: QuasarSelect<string> | null;
}
