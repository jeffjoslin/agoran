'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  GLASS_CARD,
  GLASS_HEADING_2,
  GLASS_LABEL,
  GLASS_INPUT,
  GLASS_INPUT_ERROR,
  GLASS_ERROR_TEXT,
  GLASS_BUTTON_PRIMARY,
  GLASS_CAPTION,
} from '@/styles/design-tokens';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${GLASS_CARD} w-full max-w-sm p-8`}>
      <div className="mb-8 text-center">
        <h1 className={`${GLASS_HEADING_2} text-2xl mb-1`}>Agoran Admin</h1>
        <p className={GLASS_CAPTION}>Sign in to access the dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className={GLASS_LABEL}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? GLASS_INPUT_ERROR : GLASS_INPUT}
            placeholder="admin@bizooku.com"
          />
        </div>

        <div>
          <label htmlFor="password" className={GLASS_LABEL}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={error ? GLASS_INPUT_ERROR : GLASS_INPUT}
            placeholder="••••••••"
          />
        </div>

        {error && <p className={GLASS_ERROR_TEXT}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`${GLASS_BUTTON_PRIMARY} w-full justify-center ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
