import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import api, { fetchEquipment } from '../lib/api';
import { Card, DataTable, SectionHeader, StatusPill } from '@labqms/ui';
import { FormEvent, useState } from 'react';

export default function EquipmentPage() {
  const queryClient = useQueryClient();
  const equipment = useQuery({ queryKey: ['equipment'], queryFn: fetchEquipment });
  const [name, setName] = useState('Sysmex XN-1000');
  const [identifier, setIdentifier] = useState('XN1000-001');

  const createEquipment = useMutation({
    mutationFn: async () => {
      await api.post('/equipment', { name, identifier, commissionDate: '2021-01-01' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['equipment'] }),
  });

  return (
    <Layout>
      <SectionHeader
        title="Equipment & Metrology"
        subtitle="Asset master, calibration schedule, and out-of-service tracking"
      />
      <Card title="Register Equipment">
        <form className="grid md:grid-cols-3 gap-3" onSubmit={(e: FormEvent) => { e.preventDefault(); createEquipment.mutate(); }}>
          <input value={name} onChange={(e) => setName(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2" />
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="border border-slate-300 rounded-md px-3 py-2" />
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-md">
            {createEquipment.isPending ? 'Saving...' : 'Add equipment'}
          </button>
        </form>
      </Card>
      <Card title="Equipment Register">
        <DataTable
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'identifier', header: 'Identifier' },
            { key: 'commissionDate', header: 'Commissioned' },
            {
              key: 'inService',
              header: 'Status',
              render: (value) => <StatusPill status={value ? 'in service' : 'out-of-service'} />,
            },
          ]}
          data={equipment.data || []}
        />
      </Card>
    </Layout>
  );
}
