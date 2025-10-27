import { QuasarSelect } from '../framework/Quasar';
import { Ministry } from './Ministry';
import { Role } from './Role';

export interface MemberChurch {
  id: string;
  name: string;
  profession: string | null;
  date_birth: string | null;
  naturalness: string | null;
  marital_status: string | null;
  education: string | null;
  cpf: string | null;
  email: string | null;
  email_professional: string | null;
  phone: string | null;
  phone_professional: string | null;
  cep: string | null;
  uf: string | null;
  address: string | null;
  address_number: string | null;
  neighborhood: string | null;
  city: string | null;
  complement: string | null;
  enterprise_id: string;
  type: string;
  active: number;
  date_baptismo: string | null;
  start_date: string | null;
  reason_start_date: string | null;
  church_start_date: string | null;
  end_date: string | null;
  reason_end_date: string | null;
  church_end_date: string | null;
  roles: Role[];
  ministries: Ministry[];
}
export interface DataMemberChurch {
  id?: string | null;
  name: string;
  profession: string | null;
  dateBirth: string | null;
  naturalness: string | null;
  maritalStatus: string | null;
  education: string | null;
  cpf: string | null;
  email: string | null;
  emailProfessional: string | null;
  phone: string | null;
  phoneProfessional: string | null;
  cep: string | null;
  uf: string | null;
  address: string | null;
  addressNumber: string | null;
  neighborhood: string | null;
  city: string | null;
  complement: string | null;
  type: string;
  active: number;
  dateBaptismo: string | null;
  startDate: string | null;
  // reasonStartDate: string | null;
  churchStartDate: string | null;
  endDate: string | null;
  // reasonEndDate: string | null;
  churchEndDate: string | null;
  roles: string[];
  ministries: string[];
}

export interface DataListFamily {
  member: QuasarSelect<string | null>;
  family: QuasarSelect<string | null>;
}
