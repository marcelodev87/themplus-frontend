export interface DataUser {
  name: string;
  position: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DataUserMember {
  name: string;
  position: string;
  email: string;
  password: string;
  confirmPassword?: string;
  department: string | null;
  departmentName?: string | null;
  phone: string;
}
export interface DataUserMember2 {
  name: string;
  position: string;
  email: string;
  password: string;
  confirmPassword?: string;
  department: string | null;
  departmentName?: string | null;
  phone: string | null;
}
export interface DataUserMember3 {
  enterpriseId: string;
  name: string;
  position: string;
  email: string;
  password: string;
  confirmPassword?: string;
  department: string | null;
  departmentName?: string | null;
  phone: string | null;
}

export interface DataRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nameEnterprise: string;
  position: 'Cliente' | 'Contador';
}

export interface DataPerfil {
  name: string;
  email: string;
  passwordActual: string;
  passwordNew: string;
  passwordNewConfirm: string;
  phone: string;
  department: string | null;
  departmentName: string | null;
}

export interface DataLogin {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  enterprise_id: string;
  department_id: string | null;
  created_by: string | null;
  created_at: string;
  view_enterprise_id: string;
  view_enterprise_name: string;
}
