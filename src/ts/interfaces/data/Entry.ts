import { QuasarSelect } from '../framework/Quasar';

export interface DataEntry {
  category: QuasarSelect<string> | null;
  value: number | null;
  date: string | null;
  account: QuasarSelect<string> | null;
  description: string | null;
  file: File;
}
