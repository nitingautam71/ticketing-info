import { prisma } from '@/lib/db';
import NewSettingForm from '@/components/admin/NewSettingForm';
import DeleteSettingButton from '@/components/admin/DeleteSettingButton';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <p className="text-sm text-neutral-400 mt-1">Simple key/value config used by the site (advanced — only edit if you know the key that's read).</p>
      </div>

      <NewSettingForm />

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Key</th>
                <th className="p-4">Value</th>
                <th className="p-4">Updated</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {settings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-500 text-sm">
                    No settings yet.
                  </td>
                </tr>
              ) : (
                settings.map((s) => (
                  <tr key={s.key} className="border-b border-neutral-850 last:border-0 hover:bg-neutral-950/50">
                    <td className="p-4 text-xs text-white font-mono">{s.key}</td>
                    <td className="p-4 text-xs text-neutral-300 max-w-sm truncate">{JSON.stringify(s.value)}</td>
                    <td className="p-4 text-xs text-neutral-500 whitespace-nowrap">{s.updatedAt.toLocaleString()}</td>
                    <td className="p-4">
                      <DeleteSettingButton settingKey={s.key} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
