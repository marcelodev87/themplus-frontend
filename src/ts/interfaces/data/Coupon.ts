export interface CouponEnterprise {
  id: string;
  type: string;
  name: string;
  description: string;
  discount: number;
  date_expiration: string | null;
}
