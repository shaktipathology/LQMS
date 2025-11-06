import { useQuery } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { fetchIqcChart } from '../lib/api';
import { Card, SectionHeader } from '@labqms/ui';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

export default function IqcPage() {
  const query = useQuery({
    queryKey: ['iqc-chart'],
    queryFn: () => fetchIqcChart('HEM-IQC-D-01', { analyte: 'Hb', from: '2024-03-01', to: '2024-04-01' }),
  });

  const data = query.data?.series?.data || [];

  return (
    <Layout>
      <SectionHeader
        title="Levey–Jennings IQC"
        subtitle="Westgard rule monitoring for hematology IQC daily log"
      />
      <Card title="Hemoglobin Level 1" actions={<span className="text-xs text-slate-500">Westgard overlay</span>}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#334155" fontSize={12} angle={-30} textAnchor="end" height={50} />
              <YAxis stroke="#334155" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={2} dot />
              <ReferenceLine y={query.data?.series?.meanSeries?.[0]?.value} stroke="#0f172a" />
              <ReferenceLine y={query.data?.series?.plus1sd?.[0]?.value} stroke="#f59e0b" strokeDasharray="4 4" />
              <ReferenceLine y={query.data?.series?.minus1sd?.[0]?.value} stroke="#f59e0b" strokeDasharray="4 4" />
              <ReferenceLine y={query.data?.series?.plus2sd?.[0]?.value} stroke="#ef4444" strokeDasharray="2 6" />
              <ReferenceLine y={query.data?.series?.minus2sd?.[0]?.value} stroke="#ef4444" strokeDasharray="2 6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          {(query.data?.violations || []).map((rule: any) => (
            <div key={rule.rule} className="bg-rose-100 text-rose-700 px-3 py-2 rounded-md">
              {rule.rule}: {rule.description} (points {rule.points.join(', ')})
            </div>
          ))}
          {query.data?.violations?.length === 0 && <p className="text-slate-500">No Westgard violations detected.</p>}
        </div>
      </Card>
    </Layout>
  );
}
