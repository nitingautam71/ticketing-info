export type InsuranceTier = 'Basic' | 'Premium' | 'Elite';

export interface InsurancePlan {
  id: string;
  name: string;
  tier: InsuranceTier;
  price: number;
  medicalCoverage: string;
  tripCancellation: string;
  luggageCoverage: string;
  description: string;
}

interface InsuranceProvider {
  search(): Promise<InsurancePlan[]>;
}

const PLANS: InsurancePlan[] = [
  { id: 'INS-1', name: 'SafeTravel Basic', tier: 'Basic', price: 29, medicalCoverage: '$50,000', tripCancellation: 'Up to $1,000', luggageCoverage: 'Up to $500', description: 'Essential protection for budget-minded explorers.' },
  { id: 'INS-2', name: 'SafeTravel Explorer', tier: 'Premium', price: 59, medicalCoverage: '$150,000', tripCancellation: 'Up to $5,000', luggageCoverage: 'Up to $1,500', description: 'Most popular! Excellent coverage for flight delays, lost baggage, and emergencies.' },
  { id: 'INS-3', name: 'SafeTravel Platinum Elite', tier: 'Elite', price: 99, medicalCoverage: '$1,000,000', tripCancellation: 'Up to $15,000', luggageCoverage: 'Up to $3,500', description: 'Premium comprehensive peace-of-mind including cancel-for-any-reason policy.' },
];

class MockInsuranceProvider implements InsuranceProvider {
  async search(): Promise<InsurancePlan[]> {
    return PLANS;
  }
}

export const insuranceProvider: InsuranceProvider = new MockInsuranceProvider();

export async function searchInsurancePlans(): Promise<InsurancePlan[]> {
  return insuranceProvider.search();
}
