import clsx from 'clsx';
import React from 'react';

export const Card: React.FC<React.PropsWithChildren<{ title: string; actions?: React.ReactNode }>> = ({
  title,
  actions,
  children,
}) => (
  <div className="bg-white shadow rounded-lg p-6 border border-slate-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {actions}
    </div>
    <div className="text-slate-700 space-y-3">{children}</div>
  </div>
);

export const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    draft: 'bg-slate-200 text-slate-700',
    submitted: 'bg-blue-200 text-blue-800',
    verified: 'bg-amber-200 text-amber-800',
    signed: 'bg-emerald-200 text-emerald-800',
    obsolete: 'bg-rose-200 text-rose-800',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
        colors[status] || 'bg-slate-100 text-slate-700',
      )}
    >
      {status}
    </span>
  );
};

export const SectionHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({
  title,
  subtitle,
  actions,
}) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
    {actions}
  </div>
);

export const DataTable: React.FC<{
  columns: { key: string; header: string; render?: (value: any, row: any) => React.ReactNode }[];
  data: any[];
}> = ({ columns, data }) => (
  <div className="overflow-x-auto border border-slate-200 rounded-lg">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100">
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-slate-50">
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-3 text-sm text-slate-700">
                {column.render ? column.render(row[column.key], row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const EmptyState: React.FC<{ title: string; description: string; action?: React.ReactNode }> = ({
  title,
  description,
  action,
}) => (
  <div className="border border-dashed border-slate-300 rounded-lg p-8 text-center space-y-3 text-slate-600">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm max-w-prose mx-auto">{description}</p>
    {action}
  </div>
);

export const Timeline: React.FC<{ items: { title: string; description: string; timestamp: string }[] }> = ({
  items,
}) => (
  <ol className="border-l border-slate-300 pl-6 space-y-4">
    {items.map((item, idx) => (
      <li key={idx} className="relative">
        <span className="absolute -left-2 top-1 w-3 h-3 bg-emerald-500 rounded-full" />
        <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
        <p className="text-sm text-slate-600">{item.description}</p>
        <p className="text-xs text-slate-500">{item.timestamp}</p>
      </li>
    ))}
  </ol>
);
