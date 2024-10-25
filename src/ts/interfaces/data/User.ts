export interface DataUser {
  name: string;
  position: 'admin' | 'common_user';
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DataPerfil {
  name: string;
  email: string;
  passwordActual: string;
  passwordNew: string;
  passwordNewConfirm: string;
}
