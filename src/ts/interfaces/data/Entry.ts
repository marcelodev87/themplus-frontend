import { QuasarSelect } from '../framework/Quasar';

export interface DataEntry {
  category: QuasarSelect<string> | null;
  value: string;
  date: string;
  account: QuasarSelect<string> | null;
  member: QuasarSelect<string> | null;
  description: string | null;
  file: File | null;
  type: string;
  programmed: QuasarSelect<number>;
  observation: null | string;
}
