import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { fetchDocuments } from '../../lib/api';
import { Card, DataTable, SectionHeader } from '@labqms/ui';

export default function ControlledCopiesPage() {
  const documents = useQuery({ queryKey: ['documents'], queryFn: fetchDocuments });

  const flattened = (documents.data || []).flatMap((doc: any) =>
    (doc.versions || []).map((version: any) => ({
      document: `${doc.code} v${version.version}`,
      lifecycle: version.lifecycle,
      effectiveFrom: version.effectiveFrom,
      acknowledgements: version.acknowledgements?.length || 0,
    })),
  );

  return (
    <Layout>
      <SectionHeader
        title="Controlled Copy Center"
        subtitle="Track issued copies, lifecycle status, and acknowledgement training"
      />
      <Card title="Issued Versions">
        <DataTable
          columns={[
            { key: 'document', header: 'Document' },
            { key: 'lifecycle', header: 'Lifecycle' },
            { key: 'effectiveFrom', header: 'Effective from' },
            { key: 'acknowledgements', header: 'Read & understood' },
          ]}
          data={flattened}
        />
      </Card>
    </Layout>
  );
}
