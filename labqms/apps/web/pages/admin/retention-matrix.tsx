import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { fetchRegisters } from '../../lib/api';
import { Card, DataTable, SectionHeader } from '@labqms/ui';

export default function RetentionMatrixPage() {
  const registers = useQuery({ queryKey: ['registers'], queryFn: fetchRegisters });

  return (
    <Layout>
      <SectionHeader
        title="Retention Matrix"
        subtitle="Policy-driven retention rules, legal holds, and archival targets"
      />
      <Card title="Register Retention Policies">
        <DataTable
          columns={[
            { key: 'code', header: 'Code' },
            { key: 'name', header: 'Name' },
            {
              key: 'retention',
              header: 'Retention Months',
              render: (value) => value?.retentionMonths,
            },
            {
              key: 'retention',
              header: 'Legal Hold',
              render: (value) => (value?.legalHold ? 'Yes' : 'No'),
            },
            {
              key: 'retention',
              header: 'Archival',
              render: (value) => (value?.archival || []).map((a: any) => `${a.target}:${a.location}`).join(', '),
            },
          ]}
          data={registers.data || []}
        />
      </Card>
    </Layout>
  );
}
