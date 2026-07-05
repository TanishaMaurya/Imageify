export interface CreditPackage {
  id: string;
  amount: number;
  credits: number;
  label: string;
}

export interface OrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  credits: number;
  packageLabel: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  paymentId: string | null;
  amount: number;
  creditsAdded: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
}
