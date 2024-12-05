import { QuasarSelect } from '../framework/Quasar';

export interface DataOut {
  category: QuasarSelect<string> | null;
  value: string;
  date: string;
  account: QuasarSelect<string> | null;
  description: string | null;
  file: File | null;
  type: string;
  programmed: QuasarSelect<number>;
}
