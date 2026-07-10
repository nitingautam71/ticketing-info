export interface VisaInfo {
  destinationCountry: string;
  visaRequired: boolean;
  maxStayDays?: number;
  processingTime?: string;
  fee?: number;
  requirements?: string[];
}

export interface VisaCheckParams {
  nationality: string;
  destination: string;
}

interface VisaProvider {
  check(params: VisaCheckParams): Promise<VisaInfo>;
}

/**
 * Rule-of-thumb visa checker for lead-gen purposes only — not authoritative
 * immigration advice. Swap for a real visa-rules API (e.g. Sherpa, VisaHQ)
 * before relying on it for anything beyond a conversation-starter.
 */
class MockVisaProvider implements VisaProvider {
  async check({ nationality, destination }: VisaCheckParams): Promise<VisaInfo> {
    const nat = (nationality || 'United States').toLowerCase();
    const dest = (destination || 'United Kingdom').toLowerCase();

    let requirements: string[] = [
      'Valid passport (at least 6 months validity)',
      'Proof of onward travel/return flight',
      'Proof of sufficient travel funds',
    ];
    let visaRequired = false;
    let maxStay = 90;
    let processing = 'Not required';
    let fee = 0;

    if (dest.includes('united kingdom') || dest.includes('uk')) {
      if (['united states', 'canada', 'australia', 'germany', 'france', 'japan'].some((c) => nat.includes(c))) {
        visaRequired = false;
        maxStay = 180;
      } else {
        visaRequired = true;
        maxStay = 180;
        processing = '10 - 15 Business Days';
        fee = 150;
        requirements.push('Detailed travel itinerary', 'Bank statements for past 3 months', 'Letter of invitation/hotel booking voucher');
      }
    } else if (dest.includes('japan')) {
      if (['united states', 'canada', 'germany', 'france', 'united kingdom'].some((c) => nat.includes(c))) {
        visaRequired = false;
        maxStay = 90;
      } else {
        visaRequired = true;
        maxStay = 90;
        processing = '5 - 7 Business Days';
        fee = 30;
        requirements.push('Sponsorship or hotel guarantee form', 'Income tax certificates', 'Completed Visa Application Form with photo');
      }
    } else {
      if (['united states', 'germany', 'united kingdom'].some((c) => nat.includes(c))) {
        visaRequired = false;
      } else {
        visaRequired = true;
        processing = '7 - 10 Business Days';
        fee = 60;
      }
    }

    return {
      destinationCountry: destination || 'United Kingdom',
      visaRequired,
      maxStayDays: maxStay,
      processingTime: processing,
      fee,
      requirements,
    };
  }
}

export const visaProvider: VisaProvider = new MockVisaProvider();

export async function checkVisa(params: VisaCheckParams): Promise<VisaInfo> {
  return visaProvider.check(params);
}
