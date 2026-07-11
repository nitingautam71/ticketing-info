export type TransferType = 'Private Sedan' | 'SUV' | 'Luxury Limo' | 'Shared Shuttle';

export interface Transfer {
  id: string;
  type: TransferType;
  capacity: number;
  price: number;
  duration: string;
  description: string;
}

interface TransferProvider {
  search(): Promise<Transfer[]>;
}

const TRANSFERS: Transfer[] = [
  { id: 'TF-1', type: 'Private Sedan', capacity: 3, price: 55, duration: '45m', description: 'Meet & greet at arrival hall. Private sedan with professional driver.' },
  { id: 'TF-2', type: 'SUV', capacity: 6, price: 85, duration: '45m', description: 'Spacious SUV perfect for families and excess heavy luggage.' },
  { id: 'TF-3', type: 'Luxury Limo', capacity: 4, price: 180, duration: '50m', description: 'VIP premium treatment, chilled champagne, ultimate comfort and class.' },
  { id: 'TF-4', type: 'Shared Shuttle', capacity: 12, price: 18, duration: '1h 15m', description: 'Budget friendly shared shuttle direct to central hotels.' },
];

class MockTransferProvider implements TransferProvider {
  async search(): Promise<Transfer[]> {
    return TRANSFERS;
  }
}

export const transferProvider: TransferProvider = new MockTransferProvider();

export async function searchTransfers(): Promise<Transfer[]> {
  return transferProvider.search();
}
