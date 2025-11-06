import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { fetchRegisters } from '../../lib/api';
import { Card, SectionHeader, StatusPill } from '@labqms/ui';

export default function RegistersPage() {
  const registers = useQuery({ queryKey: ['registers'], queryFn: fetchRegisters });

  return (
    <Layout>
      <SectionHeader
        title="Quality Registers"
        subtitle="Browse register definitions, workflows, and retention rules"
      />
      <div className="grid md:grid-cols-2 gap-6">
        {(registers.data || []).map((register: any) => (
          <Card
            key={register.id}
            title={`${register.code} — ${register.name}`}
            actions={<StatusPill status={register.active ? 'active' : 'inactive'} />}
          >
            <p className="text-sm text-slate-600">Stack: {register.stack}</p>
            <p className="text-sm text-slate-500">Workflow initial state: {register.workflow.initial}</p>
            <Link href={`/registers/${register.id}`} className="text-sm text-emerald-600">
              Open entries
            </Link>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
