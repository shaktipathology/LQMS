import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import api, { fetchRegisterEntries, fetchRegisters } from '../../lib/api';
import { Card, DataTable, SectionHeader, StatusPill } from '@labqms/ui';
import { useEffect, useState } from 'react';
import { HEMATOLOGY_REGISTERS } from '@labqms/schema';

export default function RegisterEntriesPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const queryClient = useQueryClient();
  const register = useQuery({ queryKey: ['register', id], queryFn: () => fetchRegisters().then((regs) => regs.find((r: any) => r.id === id)) });
  const entries = useQuery({ queryKey: ['registerEntries', id], queryFn: () => fetchRegisterEntries(id), enabled: !!id });
  const [dataJson, setDataJson] = useState('{}');

  useEffect(() => {
    if (register.data) {
      const seed = HEMATOLOGY_REGISTERS.find((item) => item.code === register.data.code);
      if (seed?.sampleEntries?.[0]) {
        setDataJson(JSON.stringify(seed.sampleEntries[0], null, 2));
      }
    }
  }, [register.data?.code]);

  const createEntry = useMutation({
    mutationFn: async () => {
      let payload: Record<string, any> = {};
      try {
        payload = JSON.parse(dataJson);
      } catch (error) {
        alert('Invalid JSON payload');
        throw error;
      }
      await api.post(`/registers/${id}/entries`, { data: payload });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['registerEntries', id] }),
  });

  return (
    <Layout>
      <SectionHeader
        title={register.data ? `${register.data.code} — ${register.data.name}` : 'Register'}
        subtitle="Capture data, submit for verification, and sign with e-signatures"
      />
      <Card title="New Entry" actions={<span className="text-xs text-slate-500">JSON schema driven</span>}>
        <textarea
          rows={10}
          value={dataJson}
          onChange={(e) => setDataJson(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 font-mono text-sm"
        />
        <button
          onClick={() => createEntry.mutate()}
          className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-md"
        >
          {createEntry.isPending ? 'Saving...' : 'Save entry'}
        </button>
      </Card>
      <Card title="Entries">
        <DataTable
          columns={[
            { key: 'createdAt', header: 'Created' },
            {
              key: 'status',
              header: 'Status',
              render: (value, row) => (
                <div className="flex items-center gap-3">
                  <StatusPill status={value} />
                  <button
                    onClick={() => api.post(`/entries/${row.id}/submit`).then(() => queryClient.invalidateQueries({ queryKey: ['registerEntries', id] }))}
                    className="text-xs text-emerald-600"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => api.post(`/entries/${row.id}/verify`).then(() => queryClient.invalidateQueries({ queryKey: ['registerEntries', id] }))}
                    className="text-xs text-emerald-600"
                  >
                    Verify
                  </button>
                </div>
              ),
            },
            {
              key: 'signatures',
              header: 'Signatures',
              render: (value, row) => (
                <div className="space-y-1 text-xs">
                  {(value || []).map((sig: any) => (
                    <div key={sig.userId} className="text-slate-600">
                      {sig.role} — {sig.signedAt}
                    </div>
                  ))}
                  <button className="text-emerald-600" onClick={() => {
                    const meaning = prompt('Meaning of signature');
                    const pin = prompt('Confirm password');
                    if (meaning && pin) {
                      api
                        .post(`/entries/${row.id}/sign`, { meaning, pin })
                        .then(() => queryClient.invalidateQueries({ queryKey: ['registerEntries', id] }));
                    }
                  }}>
                    Capture e-signature
                  </button>
                </div>
              ),
            },
          ]}
          data={entries.data || []}
        />
      </Card>
    </Layout>
  );
}
