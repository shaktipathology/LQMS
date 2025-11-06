import { useQuery } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { fetchCapas, fetchDocuments, fetchRegisterEntries } from '../lib/api';
import { Card, SectionHeader, StatusPill } from '@labqms/ui';

export default function DashboardPage() {
  const documentsQuery = useQuery({ queryKey: ['documents'], queryFn: fetchDocuments });
  const capasQuery = useQuery({ queryKey: ['capas'], queryFn: fetchCapas });
  const iqcEntriesQuery = useQuery({
    queryKey: ['register', 'HEM-IQC-D-01'],
    queryFn: () => fetchRegisterEntries('HEM-IQC-D-01'),
  });

  const pendingCapas = (capasQuery.data || []).filter((c: any) => c.status !== 'closed');

  return (
    <Layout>
      <SectionHeader
        title="Quality Command Center"
        subtitle="Monitor KPIs, approvals, and pending CAPA actions"
      />
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Controlled Documents" actions={<span className="text-sm text-slate-500">Active lifecycle</span>}>
          <p className="text-3xl font-semibold">{documentsQuery.data?.length ?? 0}</p>
          <p className="text-sm text-slate-500">Documents with traceable approvals</p>
        </Card>
        <Card title="Open CAPA Actions">
          <p className="text-3xl font-semibold">{pendingCapas.length}</p>
          <p className="text-sm text-slate-500">Due soon: {(pendingCapas || []).slice(0, 3).map((c: any) => c.actionPlan?.title).join(', ')}</p>
        </Card>
        <Card title="IQC Entries (30 days)">
          <p className="text-3xl font-semibold">{iqcEntriesQuery.data?.length ?? 0}</p>
          <p className="text-sm text-slate-500">Hematology IQC records awaiting verification</p>
        </Card>
      </div>
      <Card title="Recently Updated Documents">
        <div className="space-y-3">
          {(documentsQuery.data || []).slice(0, 5).map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{doc.title}</p>
                <p className="text-xs text-slate-500">{doc.code}</p>
              </div>
              <StatusPill status={doc.status} />
            </div>
          ))}
          {documentsQuery.data?.length === 0 && (
            <p className="text-sm text-slate-500">No documents yet. Create one from the Documents page.</p>
          )}
        </div>
      </Card>
      <Card title="CAPA Due Tracker">
        <div className="space-y-2">
          {pendingCapas.slice(0, 5).map((capa: any) => (
            <div key={capa.id} className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{capa.actionPlan?.title || 'CAPA action'}</span>
              <StatusPill status={capa.status} />
            </div>
          ))}
          {pendingCapas.length === 0 && <p className="text-sm text-slate-500">All CAPA items are closed.</p>}
        </div>
      </Card>
    </Layout>
  );
}
