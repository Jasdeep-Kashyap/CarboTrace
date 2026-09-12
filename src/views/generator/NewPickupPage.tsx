import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, QrCode, Scale, Leaf } from 'lucide-react';
import { WASTE_TYPE_LABELS, generateTrackingCode } from '@/lib/utils';
import { z } from 'zod';

const STEPS = ['Waste Details', 'Location & Bin', 'Photo Upload', 'Confirm'];

const step1Schema = z.object({
  waste_type: z.string().min(1, 'Select a waste type'),
  estimated_weight_kg: z.number({ invalid_type_error: 'Enter a valid weight' }).min(1, 'Weight must be > 0').max(10000),
  notes: z.string().optional(),
});

const WASTE_FACTORS: Record<string, { label: string; icon: string; co2: string }> = {
  food_wet:           { label: 'Food Waste (Wet)',   icon: '🍱', co2: '0.42 kg CO₂e/kg' },
  garden:             { label: 'Garden/Green Waste', icon: '🌿', co2: '0.35 kg CO₂e/kg' },
  agricultural:       { label: 'Agricultural Waste', icon: '🌾', co2: '0.31 kg CO₂e/kg' },
  industrial_organic: { label: 'Industrial Organic', icon: '🏭', co2: '0.55 kg CO₂e/kg' },
  mixed_organic:      { label: 'Mixed Organic',      icon: '♻️', co2: '0.40 kg CO₂e/kg' },
};

export default function NewPickupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const trackingCode = generateTrackingCode();

  const [form, setForm] = useState({
    waste_type: 'food_wet',
    estimated_weight_kg: 100,
    notes: '',
    address: 'The Leela Palace, 23 Old Airport Rd, Bengaluru',
    bin_qr: '',
    photo: null as File | null,
  });

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => { const copy = { ...e }; delete copy[k]; return copy; });
  }

  function validateStep1() {
    const res = step1Schema.safeParse({ waste_type: form.waste_type, estimated_weight_kg: form.estimated_weight_kg, notes: form.notes });
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach(i => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return false;
    }
    return true;
  }

  function next() {
    if (step === 0 && !validateStep1()) return;
    if (step < STEPS.length - 1) setStep(s => s + 1);
  }

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => navigate('/generator'), 1800);
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: 'hsl(142 71% 45% / 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={32} color="var(--color-success)" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Pickup Requested!</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 360 }}>Your tracking code is <code style={{ color: 'var(--color-accent)', background: 'var(--color-surface-2)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{trackingCode}</code>. WhatsApp confirmation will be sent shortly.</p>
        <div className="badge badge-teal">Redirecting to dashboard…</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/generator')} id="back-btn">
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="page-title">New Pickup Request</h1>
          <p className="page-subtitle">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: '99px', background: i <= step ? 'var(--color-accent)' : 'var(--color-border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="card" style={{ padding: '1.75rem' }}>
        {/* Step 0 — Waste Details */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Waste Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {Object.entries(WASTE_FACTORS).map(([k, v]) => (
                  <button key={k} id={`waste-type-${k}`} onClick={() => set('waste_type', k)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem',
                    borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    border: `1.5px solid ${form.waste_type === k ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: form.waste_type === k ? 'hsl(174 72% 46% / 0.08)' : 'var(--color-surface-2)',
                    color: form.waste_type === k ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    textAlign: 'left', transition: 'all 0.18s',
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>{v.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{v.label}</div>
                      <div style={{ fontSize: '0.67rem', color: 'var(--color-text-subtle)' }}>{v.co2}</div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.waste_type && <p className="form-error">{errors.waste_type}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="weight-input">Estimated Weight (kg) *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={16} color="var(--color-text-muted)" />
                <input id="weight-input" className="input-base" type="number" min={1} max={10000} value={form.estimated_weight_kg}
                  onChange={e => set('estimated_weight_kg', Number(e.target.value))} placeholder="e.g. 120" />
              </div>
              {errors.estimated_weight_kg && <p className="form-error">{errors.estimated_weight_kg}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes-input">Notes (optional)</label>
              <textarea id="notes-input" className="input-base" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. Morning kitchen waste from restaurant" style={{ resize: 'vertical' }} />
            </div>
          </div>
        )}

        {/* Step 1 — Location */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Pickup Address</label>
              <input id="address-input" className="input-base" value={form.address} onChange={e => set('address', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Scan Bin QR Code</label>
              <div style={{
                height: 140, border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', cursor: 'pointer', background: 'var(--color-surface-2)',
                color: 'var(--color-text-muted)', transition: 'border-color 0.2s',
              }} id="qr-scan-area" onClick={() => set('bin_qr', 'BIN-LEELA-001')}>
                <QrCode size={32} color="var(--color-accent)" />
                <span style={{ fontSize: '0.85rem' }}>Tap to simulate QR scan</span>
                {form.bin_qr && <span className="badge badge-green">{form.bin_qr} ✓</span>}
              </div>
            </div>

            <div style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Leaf size={14} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              Your location will be verified within a 50-metre geofence when the driver arrives.
            </div>
          </div>
        )}

        {/* Step 2 — Photo */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Upload an <strong style={{ color: 'var(--color-text)' }}>overhead photo</strong> of your waste bin. The photo must clearly show the waste type with no mixed plastics or hazardous materials.
            </div>

            <label htmlFor="photo-upload" style={{
              height: 180, border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '0.75rem', cursor: 'pointer', background: 'var(--color-surface-2)',
              color: 'var(--color-text-muted)',
            }}>
              {form.photo ? (
                <>
                  <CheckCircle2 size={32} color="var(--color-success)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-success)' }}>{form.photo.name}</span>
                </>
              ) : (
                <>
                  <Upload size={32} color="var(--color-accent)" />
                  <span style={{ fontSize: '0.875rem' }}>Click to upload overhead photo</span>
                  <span style={{ fontSize: '0.75rem' }}>JPG, PNG, WEBP · max 10 MB</span>
                </>
              )}
            </label>
            <input id="photo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => set('photo', e.target.files?.[0] ?? null)} />

            {/* AI check note */}
            <div style={{ background: 'hsl(174 72% 46% / 0.06)', border: '1px solid hsl(174 72% 46% / 0.2)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              🤖 Photos are checked by AI for contamination. Mixed plastics or hazardous materials will flag the pickup.
            </div>
          </div>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Review & Confirm</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { label: 'Waste Type',  value: WASTE_TYPE_LABELS[form.waste_type] },
                { label: 'Est. Weight', value: `${form.estimated_weight_kg} kg` },
                { label: 'Address',     value: form.address },
                { label: 'Bin QR',      value: form.bin_qr || '(not scanned)' },
                { label: 'Photo',       value: form.photo?.name || '(none)' },
                { label: 'Notes',       value: form.notes || '—' },
                { label: 'Tracking',    value: trackingCode },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', padding: '0.625rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)', minWidth: 110 }}>{row.label}</span>
                  <span style={{ fontWeight: 500, wordBreak: 'break-all' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'hsl(142 71% 45% / 0.08)', border: '1px solid hsl(142 71% 45% / 0.2)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8rem', color: 'hsl(142 71% 55%)' }}>
              ✅ Submitting will queue this pickup and send a WhatsApp confirmation.
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
        <button className="btn btn-ghost" onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/generator')} id="prev-step-btn">
          <ArrowLeft size={15} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < STEPS.length - 1 ? (
          <button className="btn btn-accent" onClick={next} id="next-step-btn">
            Continue <ArrowRight size={15} />
          </button>
        ) : (
          <button className="btn btn-accent" onClick={handleSubmit} id="submit-pickup-btn">
            Submit Pickup <CheckCircle2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
