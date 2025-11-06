import { Layout } from '../../components/Layout';
import { Card, DataTable, SectionHeader } from '@labqms/ui';

const ROLE_MATRIX = [
  { role: 'Admin', privileges: 'Full system configuration, user management, stacks' },
  { role: 'Quality Manager', privileges: 'Document approvals, register verification, CAPA oversight' },
  { role: 'Section Lead', privileges: 'Register maker-checker, equipment control, IQC review' },
  { role: 'Technologist', privileges: 'Data entry, draft preparation, IQC logging' },
  { role: 'Assessor', privileges: 'Read-only access, assessor pack export' },
];

export default function UsersRolesPage() {
  return (
    <Layout>
      <SectionHeader
        title="User & Role Manager"
        subtitle="Role-based access aligned with ISO 15189 and NABL requirements"
      />
      <Card title="Authorization Matrix">
        <DataTable
          columns={[
            { key: 'role', header: 'Role' },
            { key: 'privileges', header: 'Privileges' },
          ]}
          data={ROLE_MATRIX}
        />
      </Card>
    </Layout>
  );
}
