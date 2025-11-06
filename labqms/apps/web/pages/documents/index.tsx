import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import api, { fetchDocuments } from '../../lib/api';
import { Card, DataTable, SectionHeader, StatusPill } from '@labqms/ui';
import { FormEvent, useState } from 'react';

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const documents = useQuery({ queryKey: ['documents'], queryFn: fetchDocuments });
  const [title, setTitle] = useState('Hematology SOP');
  const [code, setCode] = useState('SOP-HEM-001');
  const [content, setContent] = useState('Purpose, scope, and responsibilities...');

  const createDoc = useMutation({
    mutationFn: async () => {
      await api.post('/documents', { title, code, content });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const issueCopy = useMutation({
    mutationFn: async ({ id, issuedTo }: { id: string; issuedTo: string }) => {
      await api.post(`/documents/${id}/issue`, { issuedTo });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    createDoc.mutate();
  };

  return (
    <Layout>
      <SectionHeader
        title="Document Control"
        subtitle="Manage drafts, approvals, and controlled copies"
      />
      <Card title="Create Document">
        <form className="grid gap-3" onSubmit={onSubmit}>
          <div>
            <label className="text-xs font-semibold text-slate-600">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2" rows={4} />
          </div>
          <button
            type="submit"
            className="self-start bg-emerald-600 text-white px-4 py-2 rounded-md"
            disabled={createDoc.isPending}
          >
            {createDoc.isPending ? 'Saving...' : 'Create document'}
          </button>
        </form>
      </Card>
      <Card title="Registered Documents">
        <DataTable
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'code', header: 'Code' },
            {
              key: 'status',
              header: 'Status',
              render: (value) => <StatusPill status={value} />,
            },
            {
              key: 'id',
              header: 'Issue controlled copy',
              render: (_, row) => (
                <button
                  onClick={() => issueCopy.mutate({ id: row.id, issuedTo: 'Hematology Bench' })}
                  className="text-sm text-emerald-600"
                >
                  Issue copy
                </button>
              ),
            },
          ]}
          data={documents.data || []}
        />
      </Card>
    </Layout>
  );
}
