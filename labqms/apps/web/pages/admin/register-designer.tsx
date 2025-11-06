import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import api, { fetchRegisters } from '../../lib/api';
import { Card, DataTable, SectionHeader } from '@labqms/ui';
import { HEMATOLOGY_REGISTERS } from '@labqms/schema';
import { useState } from 'react';

export default function RegisterDesignerPage() {
  const queryClient = useQueryClient();
  const registers = useQuery({ queryKey: ['registers'], queryFn: fetchRegisters });
  const [selectedSeed, setSelectedSeed] = useState(HEMATOLOGY_REGISTERS[0]);

  const createRegister = useMutation({
    mutationFn: async () => {
      await api.post('/registers', {
        code: selectedSeed.code,
        name: selectedSeed.name,
        stack: selectedSeed.stack,
        schema: selectedSeed.schema,
        workflow: selectedSeed.workflow,
        retention: selectedSeed.retention,
        active: true,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['registers'] }),
  });

  return (
    <Layout>
      <SectionHeader
        title="Register Designer"
        subtitle="Deploy JSON-schema driven registers with maker-checker workflows"
      />
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Seed Library" actions={<span className="text-xs text-slate-500">Hematology</span>}>
          <select
            value={selectedSeed.code}
            onChange={(e) => setSelectedSeed(HEMATOLOGY_REGISTERS.find((r) => r.code === e.target.value) || HEMATOLOGY_REGISTERS[0])}
            className="w-full border border-slate-300 rounded-md px-3 py-2"
          >
            {HEMATOLOGY_REGISTERS.map((register) => (
              <option key={register.code} value={register.code}>
                {register.code} — {register.name}
              </option>
            ))}
          </select>
          <pre className="mt-3 bg-slate-900 text-emerald-200 text-xs rounded-md p-3 overflow-auto max-h-64">
{JSON.stringify(selectedSeed.schema, null, 2)}
          </pre>
          <button
            className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-md"
            onClick={() => createRegister.mutate()}
          >
            {createRegister.isPending ? 'Publishing...' : 'Publish register'}
          </button>
        </Card>
        <Card title="Registered Definitions">
          <DataTable
            columns={[
              { key: 'code', header: 'Code' },
              { key: 'name', header: 'Name' },
              { key: 'stack', header: 'Stack' },
            ]}
            data={registers.data || []}
          />
        </Card>
      </div>
    </Layout>
  );
}
