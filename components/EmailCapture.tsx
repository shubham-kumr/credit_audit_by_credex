'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Props {
  auditId: string;
  monthlySavings: number;
}

export default function EmailCapture({ auditId, monthlySavings }: Props) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [honeypot, setHoneypot] = useState(''); // must stay empty
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [emailError, setEmailError] = useState('');

  if (dismissed) return null;

  const isHighIntent = monthlySavings > 500;

  function validateEmail(v: string) {
    if (!v) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address';
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError('');
    setStatus('loading');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audit_id: auditId,
          email: email.toLowerCase().trim(),
          company_name: company.trim() || undefined,
          role: role.trim() || undefined,
          _hp: honeypot,
        }),
      });

      if (res.ok || res.status === 201) {
        setStatus('success');
      } else if (res.status === 429) {
        setStatus('error');
        setErrorMsg('Too many requests. Please try again later.');
      } else {
        throw new Error('Server error');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mt-8 relative animate-fade-in-up">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        aria-label="Dismiss email capture"
      >
        <X className="w-4 h-4" />
      </button>

      {status === 'success' ? (
        <div className="text-center py-4">
          <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
          <h3 className="font-semibold text-neutral-800 text-lg">Check your inbox!</h3>
          <p className="text-sm text-neutral-600 mt-1">
            We&apos;ve sent your audit report to {email}.
          </p>
          {isHighIntent && (
            <p className="text-sm text-primary-700 mt-3 font-medium">
              🎯 A Credex advisor will reach out — we can often unlock 20%+ more savings.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-neutral-800 text-lg">Email me this audit</h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            Get a clean summary + be notified when new savings apply to your stack.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot — hidden from real users */}
            <input
              type="text"
              name="_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px' }}
            />

            <div className="space-y-3">
              <div>
                <label htmlFor="email-capture-input" className="block text-sm font-medium text-neutral-700 mb-1">
                  Work email <span className="text-danger">*</span>
                </label>
                <input
                  id="email-capture-input"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  placeholder="you@company.com"
                  required
                  className={`input-base ${emailError ? 'input-error' : ''}`}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
                {emailError && (
                  <p id="email-error" className="text-xs text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {emailError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="company-input" className="block text-sm font-medium text-neutral-700 mb-1">
                    Company <span className="text-neutral-400">(optional)</span>
                  </label>
                  <input
                    id="company-input"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Corp"
                    className="input-base"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="role-input" className="block text-sm font-medium text-neutral-700 mb-1">
                    Role <span className="text-neutral-400">(optional)</span>
                  </label>
                  <input
                    id="role-input"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Engineering Manager"
                    className="input-base"
                    maxLength={100}
                  />
                </div>
              </div>

              {status === 'error' && (
                <p className="text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errorMsg}
                </p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary"
                  id="email-submit-btn"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : 'Send my report'}
                </button>
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  className="btn-ghost text-sm"
                >
                  Skip for now
                </button>
              </div>
              <p className="text-xs text-neutral-400">No spam. Unsubscribe anytime.</p>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
