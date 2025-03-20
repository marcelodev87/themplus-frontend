export interface Bond {
  id: string;
  name: string;
  cnpj: string | null;
  cpf: string | null;
  email: string;
  phone: string | null;
  created_by: string | null;
  no_verified: number;
  manage_users: boolean;
}
