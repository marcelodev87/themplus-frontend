export interface DataUser {
  name: string;
  position: 'admin' | 'common_user';
  email: string;
  password: string;
  confirmPassword: string;
}
