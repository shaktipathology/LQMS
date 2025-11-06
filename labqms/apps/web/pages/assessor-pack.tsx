import { useMutation, useState } from 'react';
import { Layout } from '../components/Layout';
import api from '../lib/api';
import { Card, SectionHeader } from '@labqms/ui';

export default function AssessorPackPage() {
  const [from, setFrom] = useState('2024-01-01');
  const [to, setTo] = useState('2024-04-30');
  const [scope, setScope] = useState('ISO 15189:2022 - 8.3 Document Control');
  const [status, setStatus] = useState('');

  const buildPack = useMutation({
    mutationFn: async () => {
      const { data } = await api.get('/assessor-pack', { params: { from, to, scope } });
      setStatus(`Generated pack with ${data.documents.length} documents and ${data.registers.length} registers.`);
    },
  });

  return (
    <Layout>
      <SectionHeader
        title="Assessor Pack"
        subtitle="Compile evidence for assessors by date range and clause scope"
      />
      <Card title="Export Wizard">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-slate-600">
            From
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2" />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            To
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2" />
          </label>
          <label className="text-xs font-semibold text-slate-600 md:col-span-2">
            Scope
            <input value={scope} onChange={(e) => setScope(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2" />
          </label>
        </div>
        <button
          onClick={() => buildPack.mutate()}
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-md"
        >
          {buildPack.isPending ? 'Compiling...' : 'Generate assessor pack'}
        </button>
        {status && <p className="mt-3 text-sm text-emerald-700">{status}</p>}
      </Card>
    </Layout>
  );
}
