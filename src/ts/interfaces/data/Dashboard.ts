export interface ICardDashboard {
  src: string;
  title: string;
  valueTitle: string;
  width: string;
  color: string;
}

export interface AmountRegister {
  entry_value: number;
  out_value: number;
  period: string;
}

export interface QuantityRegister {
  entry_quantity: number;
  out_quantity: number;
  period: string;
}
