import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Building2, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mockOrgs } from '@/lib/mock-data';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const existingOrg = profile?.org_id ? mockOrgs.find(o => o.id === profile.org_id) : null;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    orgName: existingOrg?.name || '',
    orgCity: existingOrg?.city || '',
  });

  if (!profile) return null;

  function handleSubmit() {
    // In a real app, we'd save this to Supabase.
    // Redirect to the portal
    if (profile?.role === 'buyer') {
      navigate('/marketplace');
    } else {
      navigate(`/${profile?.role}`);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '2rem' }}>
      <div style={{ maxWidth: 500, margin: '4rem auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>Complete Your Profile</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
          Welcome! Just a few more details before you access the {profile.role} portal.
        </p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, height: 4, borderRadius: '99px', background: 'var(--color-accent)' }} />
          <div style={{ flex: 1, height: 4, borderRadius: '99px', background: step >= 2 ? 'var(--color-accent)' : 'var(--color-border)', transition: 'background 0.3s' }} />
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <User size={18} color="var(--color-accent)" />
                <span style={{ fontWeight: 600 }}>Personal Details</span>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="input-base" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="input-base" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
              </div>
              <button className="btn btn-accent" onClick={() => setStep(2)} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Building2 size={18} color="var(--color-accent)" />
                <span style={{ fontWeight: 600 }}>Organisation Details</span>
              </div>
              <div className="form-group">
                <label className="form-label">Organisation Name</label>
                <input className="input-base" value={form.orgName} onChange={e => setForm({ ...form, orgName: e.target.value })} placeholder="e.g. GreenTech Logistics" />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="input-base" value={form.orgCity} onChange={e => setForm({ ...form, orgCity: e.target.value })} placeholder="Bengaluru" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>
                  Back
                </button>
                <button className="btn btn-accent" onClick={handleSubmit} style={{ flex: 2, justifyContent: 'center' }}>
                  Complete Setup <CheckCircle2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
