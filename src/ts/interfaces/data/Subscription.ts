export interface ISubscriptionInfo {
  name: 'free' | 'basic' | 'advanced' | 'custom';
  price: number;
}

export type CounterSubscriptionName = 'C5' | 'C10' | 'CIlimited';

export interface ISubscription {
  id: string;
  name: 'free' | 'basic' | 'advanced' | 'etika' | CounterSubscriptionName;
  price: number;
  type?: 'client' | 'counter';
  client_limit?: number | null;
}

export interface ICounterSubscriptionUsage {
  plan: ISubscription | null;
  expired_date: string | null;
  is_active: boolean;
  limit: number | null;
  used: number;
  is_over_limit: boolean;
  excess: number;
}

export interface ICounterClientLicense {
  id: string;
  counter_enterprise_id: string;
  client_enterprise_id: string;
  subscription_id: string;
  active: boolean;
  granted_at: string;
  revoked_at: string | null;
  client_enterprise?: {
    id: string;
    name: string;
    cnpj: string | null;
    cpf: string | null;
  };
}

export interface IQrCode {
  encodedImage: string;
  payload: string;
}

export interface ICreditCardData {
  subscriptionID: string | null;
  creditCard: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement: string;
    phone: string;
  };
}
