export interface EsewaServiceOption {
  failure_url: string;
  success_url: string;
  environment: 'dev' | 'prod';
}
export type EsewaPaymentStatus =
  | 'COMPLETE'
  | 'FULL_REFUND'
  | 'PARTIAL_REFUND'
  | 'AMBIGUOUS'
  | 'NOT_FOUND'
  | 'CACELED';

export interface EsewaPaymentOption {
  amount: string;
  tax_amount: string;
  product_delivery_charge: string;
  product_service_charge: string;
  transaction_uuid: string;
}
export interface EsewaPaymentPayload {
  amount: string;
  tax_amount: string;
  product_delivery_charge: string;
  product_service_charge: string;
  transaction_uuid: string;
  failure_url: string;
  product_code: string;
  signature: string;
  signed_field_names: string;
  success_url: string;
  total_amount: string;
}
export interface EsewaApiResponseSuccess {
  transaction_code: string;
  status: EsewaPaymentStatus;
  total_amount: number;
  transaction_uuid: number;
  product_code: number;
  signed_field_names: string;
  signature: string;
}
export interface EsewaApiResponseError {
  error: string;
  data: object;
}
export interface EsewaApiResponseStatusCheck {
  product_code: string;
  transaction_uuid: string;
  total_amount: number;
  status: EsewaPaymentStatus;
  ref_id: string;
}
export type EsewaApiResponse = EsewaApiResponseSuccess | EsewaApiResponseError;
