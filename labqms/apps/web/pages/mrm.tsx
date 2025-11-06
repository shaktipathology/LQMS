import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import api from '../lib/api';
import { Card, DataTable, SectionHeader } from '@labqms/ui';
import { useState } from 'react';

const fetchMrm = async () => {
  const { data } = await api.get('/mrm');
  return data;
};

export default function MrmPage() {
  const queryClient = useQueryClient();
  const meetings = useQuery({ queryKey: ['mrm'], queryFn: fetchMrm });
  const [agenda, setAgenda] = useState('Review IQC trends');

  const createMeeting = useMutation({
    mutationFn: async () => {
      await api.post('/mrm', {
        meetingDate: '2024-04-10',
        agenda: [{ topic: agenda, owner: 'Quality Manager' }],
        actions: [
          {
            action: 'Update hematology SOP',
            owner: 'Section Lead',
            dueDate: '2024-05-01',
            status: 'Open',
          },
        ],
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mrm'] }),
  });

  return (
    <Layout>
      <SectionHeader
        title="Management Review Meetings"
        subtitle="Capture agenda, minutes, and follow-up actions"
      />
      <Card title="Plan MRM">
        <div className="flex gap-3">
          <input value={agenda} onChange={(e) => setAgenda(e.target.value)} className="flex-1 border border-slate-300 rounded-md px-3 py-2" />
          <button onClick={() => createMeeting.mutate()} className="bg-emerald-600 text-white px-4 py-2 rounded-md">
            {createMeeting.isPending ? 'Saving...' : 'Schedule meeting'}
          </button>
        </div>
      </Card>
      <Card title="Meetings">
        <DataTable
          columns={[
            { key: 'meetingDate', header: 'Date' },
            {
              key: 'agenda',
              header: 'Agenda Items',
              render: (value) => (value || []).map((item: any) => item.topic).join(', '),
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (value) => (value || []).map((item: any) => `${item.action} (${item.status})`).join('; '),
            },
          ]}
          data={meetings.data || []}
        />
      </Card>
    </Layout>
  );
}
