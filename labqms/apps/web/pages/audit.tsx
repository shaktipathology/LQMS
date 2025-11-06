import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import api from '../lib/api';
import { Card, DataTable, SectionHeader } from '@labqms/ui';
import { useState } from 'react';

const fetchAudits = async () => {
  const { data } = await api.get('/audits');
  return data;
};

export default function AuditPage() {
  const queryClient = useQueryClient();
  const audits = useQuery({ queryKey: ['audits'], queryFn: fetchAudits });
  const [scope, setScope] = useState('Hematology annual audit');

  const createAudit = useMutation({
    mutationFn: async () => {
      await api.post('/audits', {
        scope,
        plannedOn: '2024-06-15',
        checklist: [{ clause: 'ISO 15189:2022 - 8.3', question: 'Controlled copy compliance' }],
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['audits'] }),
  });

  return (
    <Layout>
      <SectionHeader
        title="Internal Audits"
        subtitle="Plan audits, store checklists, and monitor CAPA linkage"
      />
      <Card title="Schedule Audit">
        <div className="flex gap-3">
          <input value={scope} onChange={(e) => setScope(e.target.value)} className="flex-1 border border-slate-300 rounded-md px-3 py-2" />
          <button onClick={() => createAudit.mutate()} className="bg-emerald-600 text-white px-4 py-2 rounded-md">
            {createAudit.isPending ? 'Saving...' : 'Create audit'}
          </button>
        </div>
      </Card>
      <Card title="Audit Program">
        <DataTable
          columns={[
            { key: 'scope', header: 'Scope' },
            { key: 'plannedOn', header: 'Planned date' },
            {
              key: 'findings',
              header: 'Findings',
              render: (value) => (value || []).length,
            },
          ]}
          data={audits.data || []}
        />
      </Card>
    </Layout>
  );
}
