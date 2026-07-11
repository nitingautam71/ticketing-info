'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

interface CustomerFormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  gender: string;
  dob: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  visaStatus: string;
  addressStreet: string;
  addressCity: string;
  addressCountry: string;
  addressZip: string;
  notes: string;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500';

export default function CustomerEditForm({ customer }: { customer: CustomerFormData }) {
  const router = useRouter();
  const [form, setForm] = useState(customer);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof CustomerFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaved(true);
      router.refresh();
    } catch {
      setError('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Personal Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name">
            <input type="text" value={form.name} onChange={set('name')} className={inputClass} />
          </Field>
          <Field label="Gender">
            <input type="text" value={form.gender} onChange={set('gender')} className={inputClass} />
          </Field>
          <Field label="Date of Birth">
            <input type="date" value={form.dob} onChange={set('dob')} className={inputClass} />
          </Field>
          <Field label="Nationality">
            <input type="text" value={form.nationality} onChange={set('nationality')} className={inputClass} />
          </Field>
          <Field label="Passport Number">
            <input type="text" value={form.passportNumber} onChange={set('passportNumber')} className={inputClass} />
          </Field>
          <Field label="Passport Expiry">
            <input type="date" value={form.passportExpiry} onChange={set('passportExpiry')} className={inputClass} />
          </Field>
          <Field label="Visa Status">
            <input type="text" value={form.visaStatus} onChange={set('visaStatus')} className={inputClass} />
          </Field>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Email">
            <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
          </Field>
          <Field label="Mobile">
            <input type="text" value={form.phone} onChange={set('phone')} className={inputClass} />
          </Field>
          <Field label="WhatsApp">
            <input type="text" value={form.whatsapp} onChange={set('whatsapp')} className={inputClass} />
          </Field>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Street">
            <input type="text" value={form.addressStreet} onChange={set('addressStreet')} className={inputClass} />
          </Field>
          <Field label="City">
            <input type="text" value={form.addressCity} onChange={set('addressCity')} className={inputClass} />
          </Field>
          <Field label="Country">
            <input type="text" value={form.addressCountry} onChange={set('addressCountry')} className={inputClass} />
          </Field>
          <Field label="ZIP">
            <input type="text" value={form.addressZip} onChange={set('addressZip')} className={inputClass} />
          </Field>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Notes</h2>
        <textarea rows={4} value={form.notes} onChange={set('notes')} className={`${inputClass} resize-none`} />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <span className="text-xs text-emerald-400 font-bold">Saved</span>}
      </div>
    </form>
  );
}
