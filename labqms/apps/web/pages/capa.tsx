import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import api, { fetchCapas, fetchOccurrences } from '../lib/api';
import { Card, DataTable, SectionHeader, StatusPill } from '@labqms/ui';
import { useState } from 'react';

export default function CapaPage() {
  const queryClient = useQueryClient();
  const capas = useQuery({ queryKey: ['capas'], queryFn: fetchCapas });
  const occurrences = useQuery({ queryKey: ['occurrences'], queryFn: fetchOccurrences });
  const [action, setAction] = useState('Retrain staff on sample labeling');

  const createCapa = useMutation({
    mutationFn: async () => {
      const occurrenceId = occurrences.data?.[0]?.id;
      if (!occurrenceId) {
        alert('Log an occurrence before creating CAPA');
        return;
      }
      await api.post('/capas', {
        occurrenceId,
        actionPlan: { title: action, owner: 'Quality Manager' },
        dueDate: '2024-04-30',
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['capas'] }),
  });

  return (
    <Layout>
      <SectionHeader
        title="CAPA Management"
        subtitle="Drive corrective and preventive actions with effectiveness checks"
      />
      <Card title="Plan CAPA">
        <div className="flex gap-3">
          <input value={action} onChange={(e) => setAction(e.target.value)} className="flex-1 border border-slate-300 rounded-md px-3 py-2" />
          <button onClick={() => createCapa.mutate()} className="bg-emerald-600 text-white px-4 py-2 rounded-md">
            {createCapa.isPending ? 'Saving...' : 'Create CAPA'}
          </button>
        </div>
      </Card>
      <Card title="CAPA Register">
        <DataTable
          columns={[
            { key: 'actionPlan', header: 'Action', render: (value) => value?.title },
            { key: 'dueDate', header: 'Due date' },
            {
              key: 'status',
              header: 'Status',
              render: (value) => <StatusPill status={value} />,
            },
          ]}
          data={capas.data || []}
        />
      </Card>
    </Layout>
  );
}
