export interface Congregation {
  id: string;
  name: string;
  date_foundation: string | null;
  cnpj: string | null;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  cep: string | null;
  uf: string | null;
  address: string | null;
  address_number: string | null;
  neighborhood: string | null;
  city: string | null;
  complement: string | null;
  member_id: string | null;
  enterprise_id: string;
}

export interface DataCongregation {
  id?: string;
  name: string;
  dateFoundation: string | null;
  cnpj: string | null;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  cep: string | null;
  uf: string | null;
  address: string | null;
  addressNumber: string | null;
  neighborhood: string | null;
  city: string | null;
  complement: string | null;
  memberID: string | null;
}
