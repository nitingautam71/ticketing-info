import type { Metadata } from 'next';
import Link from 'next/link';
import { LayoutDashboard, Users, UserCog, CheckSquare, BookOpen, Mail, LogOut, Star, HelpCircle, Newspaper, Settings, IdCard } from 'lucide-react';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/customers', label: 'Customers', icon: IdCard },
  { href: '/admin/agents', label: 'Agents', icon: UserCog },
  { href: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/admin/bookings', label: 'Bookings', icon: BookOpen },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 md:px-8 pt-24 pb-16 gap-8">
      <aside className="lg:w-56 shrink-0">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible bg-neutral-900 border border-neutral-800 rounded-2xl p-2">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors whitespace-nowrap"
              >
                <Icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
          <a
            href="/admin/logout"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-red-950/20 transition-colors whitespace-nowrap mt-2 lg:border-t lg:border-neutral-800 lg:pt-3"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </a>
        </nav>
      </aside>

      <div className="flex-1 min-w-0 space-y-6">{children}</div>
    </div>
  );
}
