export interface DataEnterprise {
  id: string;
  name: string;
  email: string;
  cnpj: string;
  cpf: string;
  cep: string;
  state: string;
  city: string;
  address: string;
  phone: string;
  numberAddress: string;
  complement: string;
  neighborhood: string;
}

export interface Enterprise {
  id: string;
  name: string;
  cnpj: string | null;
  cpf: string | null;
  cep: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  complement: string | null;
  number_address: string | null;
  email: string | null;
  phone: string | null;
  subscription_id?: string;
}

export interface Office {
  id: string;
  name: string;
  total_users: number;
  counter: string | null;
}
