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
  observation: string | null;
  enterprise_id: string | null;
}

export interface MovementAnalyze {
  id: string;
  date_movement: string;
  type: string;
  value: number;
  receipt: string | null;
  description: string;
  enterprise_id: string;
  created: string;
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

export interface DataMovementAnalyze {
  id: string;
  enterprise_id: string;
  type: string;
  value: string;
  date_movement: string;
  receipt: File | null;
  account: QuasarSelect<string>;
  category: QuasarSelect<string>;
  description: string | null;
}
