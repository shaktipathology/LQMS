import { Layout } from '../../components/Layout';
import { Card, SectionHeader } from '@labqms/ui';
import { DEFAULT_STACKS, HEMATOLOGY_REGISTERS } from '@labqms/schema';

export default function StacksPage() {
  return (
    <Layout>
      <SectionHeader
        title="Stacks Manager"
        subtitle="Toggle laboratory stacks and review register coverage"
      />
      <div className="grid md:grid-cols-2 gap-6">
        {DEFAULT_STACKS.map((stack) => (
          <Card key={stack} title={stack} actions={<span className="text-xs text-emerald-600">Enabled</span>}>
            <p className="text-sm text-slate-600">Registers available: {HEMATOLOGY_REGISTERS.length}</p>
            <ul className="mt-2 text-xs text-slate-500 space-y-1">
              {HEMATOLOGY_REGISTERS.map((register) => (
                <li key={register.code}>• {register.code}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
