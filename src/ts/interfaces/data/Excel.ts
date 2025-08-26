import { QuasarSelect } from '../framework/Quasar';

export interface ExcelData {
  descricao: string;
  tipo: string;
  valor: string;
  dataMovimentacao: string;
  categoryID: string | null;
  account: QuasarSelect<string>;
  category: QuasarSelect<string>;
  accountID: string | null;
}
