import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import api, { fetchOccurrences } from '../lib/api';
import { Card, DataTable, SectionHeader, StatusPill } from '@labqms/ui';
import { useState } from 'react';

export default function OccurrencePage() {
  const queryClient = useQueryClient();
  const occurrences = useQuery({ queryKey: ['occurrences'], queryFn: fetchOccurrences });
  const [title, setTitle] = useState('Hematology bench NC');
  const [description, setDescription] = useState('Sample clotted prior to analysis');

  const createOccurrence = useMutation({
    mutationFn: async () => {
      await api.post('/occurrences', {
        title,
        description,
        rootCause: { method: '5-Why', summary: 'Training gap' },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['occurrences'] }),
  });

  return (
    <Layout>
      <SectionHeader
        title="Occurrence & Nonconformity"
        subtitle="Log events, analyze root causes, and trigger CAPA workflows"
      />
      <Card title="Report Occurrence">
        <div className="grid gap-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2" rows={3} />
          <button onClick={() => createOccurrence.mutate()} className="bg-emerald-600 text-white px-4 py-2 rounded-md">
            {createOccurrence.isPending ? 'Saving...' : 'Log occurrence'}
          </button>
        </div>
      </Card>
      <Card title="Occurrence Register">
        <DataTable
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'description', header: 'Description' },
            {
              key: 'status',
              header: 'Status',
              render: (value) => <StatusPill status={value} />,
            },
          ]}
          data={occurrences.data || []}
        />
      </Card>
    </Layout>
  );
}
