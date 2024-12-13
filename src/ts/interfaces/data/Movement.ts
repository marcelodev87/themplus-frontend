import { QuasarSelect } from '../framework/Quasar';
import { Account } from './Account';
import { Category } from './Category';

export interface Movement {
  id: string;
  type: string;
  value: number;
  date_movement: string;
  description: string;
  receipt: string;
  category_id: string;
  account_id: string;
  account: Account | null;
  category: Category | null;
}

export interface InsertMovement {
  tipo: string;
  dataMovimentacao: string;
  valor: string;
  descricao: string;
  account: QuasarSelect<string>;
  category: QuasarSelect<string>;
  receipt?: File | null;
}
export interface InsertMovementData {
  type: string;
  date: string;
  value: string;
  description: string;
  account: string;
  category: string;
  receipt?: File | null;
  programmed: number;
}
