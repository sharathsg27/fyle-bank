export interface IBank {
  readonly id?: string;
  readonly bank_name: string;
  readonly bank_id: number;
  readonly branch: string;
  readonly ifsc: string;
  readonly state: string;
  readonly district: string;
  readonly city: string;
  readonly address: string;
  isFavorite?: boolean;
}
