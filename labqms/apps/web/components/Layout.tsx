import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/documents', label: 'Documents' },
  { href: '/registers', label: 'Registers' },
  { href: '/iqc', label: 'IQC' },
  { href: '/equipment', label: 'Equipment' },
  { href: '/occurrence', label: 'Occurrences' },
  { href: '/capa', label: 'CAPA' },
  { href: '/audit', label: 'Internal Audit' },
  { href: '/mrm', label: 'MRM' },
  { href: '/assessor-pack', label: 'Assessor Pack' },
];

const adminItems = [
  { href: '/admin/register-designer', label: 'Register Designer' },
  { href: '/admin/retention-matrix', label: 'Retention Matrix' },
  { href: '/admin/stacks', label: 'Stacks Manager' },
  { href: '/admin/controlled-copies', label: 'Controlled Copies' },
  { href: '/admin/users-roles', label: 'Users & Roles' },
];

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const renderNav = (items: typeof navItems) => (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = router.pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-md text-sm font-medium ${
              active ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr] gap-6 p-6">
      <aside className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">AIIMS Bhopal</h1>
          <p className="text-xs text-slate-500">Department of Pathology &amp; Lab Medicine</p>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Operations</h2>
          {renderNav(navItems)}
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Administration</h2>
          {renderNav(adminItems)}
        </div>
      </aside>
      <main className="space-y-6">{children}</main>
    </div>
  );
};
