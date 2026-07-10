import React, { useState } from 'react';
import { CreditCard, ShieldCheck, X, CheckCircle, Receipt, Lock, HelpCircle } from 'lucide-react';
import { Booking } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingItem: {
    type: 'flight' | 'hotel' | 'cruise' | 'train' | 'rental' | 'transfer' | 'insurance' | 'visa' | 'package';
    title: string;
    subtitle: string;
    price: number;
    date: string;
    details: any;
  } | null;
  onSuccess: (newBooking: Booking) => void;
}

export default function CheckoutModal({ isOpen, onClose, bookingItem, onSuccess }: CheckoutModalProps) {
  if (!isOpen || !bookingItem) return null;

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [addInsurance, setAddInsurance] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const insuranceCost = Math.max(19, Math.floor(bookingItem.price * 0.08));
  const taxesAndFees = Math.floor(bookingItem.price * 0.12);
  const totalAmount = bookingItem.price + taxesAndFees + (addInsurance ? insuranceCost : 0);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      tempErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
      tempErrors.expiry = 'Expiration must be MM/YY';
    }
    if (cvv.length !== 3) {
      tempErrors.cvv = 'CVV must be 3 digits';
    }
    if (nameOnCard.trim().length < 3) {
      tempErrors.nameOnCard = 'Enter the full name on card';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);

    // Simulate Payment Processor Delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const finalBooking: Booking = {
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      type: bookingItem.type,
      title: bookingItem.title,
      subtitle: bookingItem.subtitle,
      status: 'confirmed',
      price: totalAmount,
      date: bookingItem.date,
      details: {
        ...bookingItem.details,
        paidWith: `Visa •••• ${cardNumber.slice(-4)}`,
        insuranceAdded: addInsurance,
        transactionDate: new Date().toLocaleDateString(),
        subtotal: bookingItem.price,
        taxes: taxesAndFees,
        insuranceCost: addInsurance ? insuranceCost : 0
      },
      qrCode: `${bookingItem.type.toUpperCase()}_PAY_${Date.now()}`
    };

    setIsProcessing(false);
    setIsCompleted(true);
    setConfirmedBooking(finalBooking);

    // Call server to persist the booking
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalBooking)
      });
    } catch (err) {
      console.error('Failed to sync booking to backend:', err);
    }
  };

  const handleCloseSuccess = () => {
    if (confirmedBooking) {
      onSuccess(confirmedBooking);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div id="checkout_card" className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-height-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Form Panel */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[90vh]">
          {!isCompleted ? (
            <>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Lock className="text-emerald-500 w-5 h-5" />
                    <h3 className="text-xl font-semibold text-white tracking-tight">Secure Checkout</h3>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Simulated Payment Methods */}
                <div className="flex gap-3 mb-6">
                  <button className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center gap-2 text-white text-sm font-medium">
                    <CreditCard className="w-4 h-4 text-emerald-400" /> Credit Card
                  </button>
                  <button type="button" className="flex-1 py-3 px-4 rounded-xl bg-neutral-950/40 border border-neutral-800 flex items-center justify-center gap-2 text-neutral-400 text-sm hover:text-white transition-colors">
                    <span>stripe</span>
                  </button>
                </div>

                <form onSubmit={handlePay} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Name on Card</label>
                    <input 
                      type="text" 
                      placeholder="Jane Doe"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      className={`w-full bg-neutral-950 border ${errors.nameOnCard ? 'border-red-500' : 'border-neutral-800'} rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                    />
                    {errors.nameOnCard && <p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardChange}
                        className={`w-full bg-neutral-950 border ${errors.cardNumber ? 'border-red-500' : 'border-neutral-800'} rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1">Expiration Date</label>
                      <input 
                        type="text" 
                        maxLength={5}
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className={`w-full bg-neutral-950 border ${errors.expiry ? 'border-red-500' : 'border-neutral-800'} rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                      />
                      {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1">CVV / Security Code</label>
                      <input 
                        type="password" 
                        maxLength={3}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className={`w-full bg-neutral-950 border ${errors.cvv ? 'border-red-500' : 'border-neutral-800'} rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                      />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="bg-neutral-950/50 p-4 border border-neutral-850 rounded-xl flex items-start gap-3 mt-4">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-white">Stripe Verified 3D-Secure</p>
                      <p className="text-[11px] text-neutral-500">Your connection is 256-bit encrypted. We strictly adhere to PCI-DSS standards.</p>
                    </div>
                  </div>
                </form>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] transition-all text-white font-medium py-3.5 px-4 rounded-xl mt-6 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Pay Now ${totalAmount.toLocaleString()}</>
                )}
              </button>
            </>
          ) : (
            /* Complete Success Screen */
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white">Booking Confirmed!</h3>
              <p className="text-neutral-400 text-sm max-w-sm">
                Your payment was successfully processed. A confirmation has been sent to your registered email address.
              </p>
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 w-full max-w-md text-left mt-2">
                <p className="text-xs text-neutral-500 font-mono">BOOKING ID: {confirmedBooking?.id}</p>
                <p className="text-sm font-semibold text-white mt-1">{confirmedBooking?.title}</p>
                <p className="text-xs text-neutral-400">{confirmedBooking?.subtitle}</p>
                <div className="border-t border-neutral-800 mt-3 pt-3 flex justify-between items-center">
                  <span className="text-xs text-neutral-400 font-medium">Total Paid</span>
                  <span className="text-sm font-bold text-emerald-400">${confirmedBooking?.price.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleCloseSuccess}
                className="w-full max-w-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl cursor-pointer transition-colors"
              >
                Go to My Trips
              </button>
            </div>
          )}
        </div>

        {/* Right Summary Panel */}
        <div className="w-full md:w-[360px] bg-neutral-950 border-t md:border-t-0 md:border-l border-neutral-800 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight uppercase mb-4 text-neutral-400">Trip Summary</h4>
            <div className="space-y-4">
              <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded-full inline-block mb-2">
                  {bookingItem.type}
                </span>
                <h5 className="text-sm font-bold text-white leading-snug">{bookingItem.title}</h5>
                <p className="text-xs text-neutral-400 mt-1">{bookingItem.subtitle}</p>
                <p className="text-[11px] text-neutral-500 font-mono mt-2">Date: {bookingItem.date}</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs pt-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Base Rate</span>
                  <span>${bookingItem.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Taxes & Carrier Fees</span>
                  <span>${taxesAndFees.toLocaleString()}</span>
                </div>
                {addInsurance && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Travel Protection</span>
                    <span>${insuranceCost.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-neutral-800 my-2 pt-2 flex justify-between font-bold text-sm text-white">
                  <span>Total Due</span>
                  <span className="text-emerald-400">${totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Upsell */}
          {!isCompleted && (
            <div className="mt-6 bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white">Add Travel Protection?</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Covers 100% trip cancellation, medical emergencies, and baggage loss for just 8% of the booking value.
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-emerald-400">+ ${insuranceCost} / traveler</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={addInsurance}
                    onChange={(e) => setAddInsurance(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
