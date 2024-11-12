export interface DataUser {
  name: string;
  position: 'admin' | 'common_user';
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DataUserMember {
  name: string;
  position: 'admin' | 'common_user';
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface DataRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nameEnterprise: string;
}

export interface DataPerfil {
  name: string;
  email: string;
  passwordActual: string;
  passwordNew: string;
  passwordNewConfirm: string;
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
}
