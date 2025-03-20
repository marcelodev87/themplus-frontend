export interface OrderCounter {
  id: string;
  created_at: string;
  enterprise_id: string;
  enterprise_counter_id: string;
  description: string | null;
  enterprise: {
    cnpj: string | null;
    cpf: string | null;
    email: string;
    id: string;
    name: string;
  };
}
export interface OrderClient {
  id: string;
  created_at: string;
  enterprise_id: string;
  enterprise_counter_id: string;
  description: string | null;
  counter: {
    cnpj: string | null;
    cpf: string | null;
    email: string;
    id: string;
    name: string;
  };
}
