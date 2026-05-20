export interface SalaryComponent {
  id: number;
  name: string;
  code: string;
  category: 'allowance' | 'deduction' | 'benefit';
  type: 'fixed' | 'calculated' | 'one-time';
  default_amount: number;
  is_taxable: boolean;
  is_active: boolean;
}

