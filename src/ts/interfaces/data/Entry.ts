import { QuasarSelect } from '../framework/Quasar';

export interface DataEntry {
  category: QuasarSelect<string> | null;
  value: string;
  date: string;
  account: QuasarSelect<string> | null;
  description: string | null;
  file: File | null;
  type: string;
}
