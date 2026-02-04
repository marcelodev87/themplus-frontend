export interface ISubscriptionInfo {
  name: 'free' | 'basic' | 'advanced' | 'custom';
  price: number;
}

export interface ISubscription {
  id: string;
  name: 'free' | 'basic' | 'advanced' | 'etika';
  price: number;
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
