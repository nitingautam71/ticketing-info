import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const [messages, newsletterCount] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-sm text-neutral-400 mt-1">Contact form submissions.</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-neutral-300">
          <span className="font-black text-emerald-400">{newsletterCount}</span> active newsletter subscribers
        </div>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-sm">No messages yet.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-bold text-white">{m.name} <span className="text-neutral-500 font-normal">— {m.email}</span></p>
                  {m.subject && <p className="text-xs text-neutral-400 mt-0.5">{m.subject}</p>}
                </div>
                <span className="text-[10px] text-neutral-500 font-mono whitespace-nowrap">{m.createdAt.toLocaleString()}</span>
              </div>
              <p className="text-sm text-neutral-300 mt-3 leading-relaxed">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
