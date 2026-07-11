export type BookingVertical =
  | 'flight'
  | 'hotel'
  | 'cruise'
  | 'train'
  | 'car'
  | 'transfer'
  | 'insurance'
  | 'package'
  | 'visa';

/** The shape passed to the lead-capture (Booking Enquiry) flow whenever a user picks a result. */
export interface BookingEnquiryItem {
  vertical: BookingVertical;
  title: string;
  subtitle: string;
  price: number;
  date: string;
  details: Record<string, unknown>;
}
