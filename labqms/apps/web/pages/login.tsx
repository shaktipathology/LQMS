import { FormEvent, useState } from 'react';
import { login } from '../lib/api';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@aiimsbhopal.edu');
  const [password, setPassword] = useState('Labqms@123');
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password, totp);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-lg rounded-lg p-8 space-y-4 w-full max-w-md border border-slate-200"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">LabQMS Login</h1>
          <p className="text-sm text-slate-500">AIIMS Bhopal – Department of Pathology &amp; Lab Medicine</p>
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">TOTP</label>
          <input
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2"
            placeholder="Enter 2FA token if enabled"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md px-3 py-2"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
