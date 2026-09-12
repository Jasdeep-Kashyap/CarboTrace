import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Leaf,
  ArrowLeft,
  ArrowRight,
  Building2,
  Package,
  Truck,
  Recycle,
  ShieldCheck,
  ShoppingCart,
  Check,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Briefcase
} from 'lucide-react';
import { useAuth, type RegisterData } from '@/hooks/useAuth';
import type { UserRole } from '@/types/database';

interface RoleOption {
  role: UserRole;
  label: string;
  badge: string;
  icon: React.ReactNode;
  color: string;
  desc: string;
  defaultOrgName: string;
  defaultOrgType: string;
  defaultCity: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'generator',
    label: 'Generator / Waste Producer',
    badge: 'Source Producer',
    icon: <Package size={22} />,
    color: '#8FF075',
    desc: 'Hotels, restaurants, markets, housing societies. Schedule smart pickups, upload overhead bin photos, verify custody, and log carbon offsets.',
    defaultOrgName: 'The Leela Palace Bengaluru',
    defaultOrgType: 'hotel',
    defaultCity: 'Bengaluru',
  },
  {
    role: 'driver',
    label: 'Collection Logistics Driver',
    badge: 'Logistics Partner',
    icon: <Truck size={22} />,
    color: '#3B82F6',
    desc: 'Authorized transport drivers. Manage optimized routes, 50m geofence auto-arrivals, digital weighbridge receipts, and real-time handoffs.',
    defaultOrgName: 'EcoLogistics Swift Fleet',
    defaultOrgType: 'logistics',
    defaultCity: 'Bengaluru',
  },
  {
    role: 'recycler',
    label: 'Recycler / Facility Operator',
    badge: 'Processing Plant',
    icon: <Recycle size={22} />,
    color: '#00D2EF',
    desc: 'Biochar kilns, composting sites, and biogas plants. Claim incoming feedstock batches, track energy inputs, and generate lab-certified yields.',
    defaultOrgName: 'GreenCycle Biochar Facility',
    defaultOrgType: 'recycler',
    defaultCity: 'Pune',
  },
  {
    role: 'checker',
    label: 'Independent Auditor / Verifier',
    badge: 'MRV Assurance',
    icon: <ShieldCheck size={22} />,
    color: '#AC4BFF',
    desc: 'Accredited third-party carbon auditors. Review immutable telemetry, verify laboratory tests, resolve disputes, and mint verified W2C credits.',
    defaultOrgName: 'Veritas Carbon Verification Bureau',
    defaultOrgType: 'checker',
    defaultCity: 'Bengaluru',
  },
  {
    role: 'buyer',
    label: 'Corporate Carbon Buyer',
    badge: 'ESG Offsetting',
    icon: <ShoppingCart size={22} />,
    color: '#F99C00',
    desc: 'Corporate sustainability & ESG officers. Purchase transparent, high-permanence W2C credits and instantly download retirement certificates.',
    defaultOrgName: 'Infosys Global ESG Fund',
    defaultOrgType: 'buyer',
    defaultCity: 'Bengaluru',
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('generator');
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    orgName: '',
    orgType: 'hotel',
    city: 'Bengaluru',
    state: 'Karnataka',
    gstin: '',
  });

  const activeRoleConfig = ROLES.find(r => r.role === selectedRole) || ROLES[0];

  function handleSelectRole(role: UserRole) {
    setSelectedRole(role);
    setErrorMsg(null);
    const cfg = ROLES.find(r => r.role === role);
    if (cfg && !form.orgName) {
      setForm(prev => ({
        ...prev,
        orgName: cfg.defaultOrgName,
        orgType: cfg.defaultOrgType,
        city: cfg.defaultCity,
      }));
    }
  }

  function handleQuickPrefill() {
    const cfg = activeRoleConfig;
    setForm({
      fullName: selectedRole === 'generator' ? 'Priya Sharma' : selectedRole === 'driver' ? 'Ravi Kumar' : selectedRole === 'recycler' ? 'Dr. Anil Mehta' : selectedRole === 'checker' ? 'Dr. Meena Nair' : 'Siddharth Rao',
      email: `${selectedRole}.lead@carbotrace.org`,
      password: 'DemoPassword2026!',
      phone: '+91 98765 43210',
      orgName: cfg.defaultOrgName,
      orgType: cfg.defaultOrgType,
      city: cfg.defaultCity,
      state: 'Karnataka',
      gstin: '29AABCT1332L1ZB',
    });
    setErrorMsg(null);
  }

  async function handleRegister(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!form.fullName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      setStep(2);
      return;
    }

    if (!form.email.trim() || !form.email.includes('@')) {
      setErrorMsg('Please provide a valid corporate or work email address.');
      setStep(2);
      return;
    }

    if (!form.password || form.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setStep(2);
      return;
    }

    if (!form.orgName.trim()) {
      setErrorMsg('Please enter your organisation or facility name.');
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      const payload: RegisterData = {
        role: selectedRole,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || '+91 98765 43210',
        orgName: form.orgName.trim(),
        orgType: form.orgType,
        city: form.city.trim() || 'Bengaluru',
        state: form.state.trim() || 'Karnataka',
        gstin: form.gstin.trim() || undefined,
      };

      const result = await register(payload);

      if (!result.success) {
        setErrorMsg(result.error || 'Registration failed. Please verify your details.');
        setLoading(false);
        return;
      }

      setSuccessMsg(`Welcome to CarboTrace, ${form.fullName}! Initializing your MRV account...`);

      // Smooth transition to onboarding / portal
      setTimeout(() => {
        navigate('/onboarding');
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrorMsg(msg);
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0D10',
      color: '#E2E8F0',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflowX: 'hidden',
      paddingBottom: '3rem',
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'fixed',
        top: '5%',
        left: '10%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(143, 240, 117, 0.08) 0%, transparent 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '10%',
        width: 450,
        height: 450,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 210, 239, 0.07) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '2.5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.25rem' }}>
          <Link
            to="/login"
            id="back-to-login-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255, 255, 255, 0.65)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.5rem 0.875rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>

          {/* Quick Prefill Pill for easy evaluation */}
          <button
            type="button"
            onClick={handleQuickPrefill}
            id="btn-quick-prefill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(143, 240, 117, 0.12)',
              border: '1px solid rgba(143, 240, 117, 0.3)',
              color: '#8FF075',
              padding: '0.45rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Sparkles size={14} /> Prefill Sample Info
          </button>
        </div>

        {/* Brand Header -> Home */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', textDecoration: 'none', cursor: 'pointer' }} title="Go to CarboTrace Home">
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(143, 240, 117, 0.2), rgba(0, 210, 239, 0.2))',
            border: '1px solid rgba(143, 240, 117, 0.4)',
            boxShadow: '0 0 20px rgba(143, 240, 117, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Leaf size={22} color="#8FF075" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.35rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Carbo<span style={{ color: '#8FF075' }}>Trace</span>
              </span>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '0.04em',
              }}>
                MRV v2.4 PROTOCOL
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.02em' }}>
              High-Assurance Waste-to-Carbon Registration
            </p>
          </div>
        </Link>

        {/* Title & Stepper indicator */}
        <div style={{
          background: '#0F1217',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          marginBottom: '1.75rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                Register Your Organisation
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                {step === 1 ? 'Step 1 of 2: Select your role in the MRV custody chain' : 'Step 2 of 2: Provide account and facility credentials'}
              </p>
            </div>

            {/* Stepper Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: step === 1 ? 'rgba(143, 240, 117, 0.2)' : 'transparent',
                  color: step === 1 ? '#8FF075' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>1.</span> Choose Persona
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: step === 2 ? 'rgba(143, 240, 117, 0.2)' : 'transparent',
                  color: step === 2 ? '#8FF075' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>2.</span> Org Details
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: step === 1 ? '50%' : '100%',
              background: 'linear-gradient(90deg, #8FF075, #00D2EF)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1.15rem',
            borderRadius: '10px',
            background: 'rgba(251, 44, 54, 0.12)',
            border: '1px solid rgba(251, 44, 54, 0.3)',
            color: '#FF6B6B',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1.15rem',
            borderRadius: '10px',
            background: 'rgba(143, 240, 117, 0.15)',
            border: '1px solid rgba(143, 240, 117, 0.4)',
            color: '#8FF075',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: ROLE SELECTION */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Your Operating Role
              </span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                Click a card below to select
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
              {ROLES.map(r => {
                const isSelected = selectedRole === r.role;
                return (
                  <div
                    key={r.role}
                    id={`register-role-${r.role}`}
                    onClick={() => handleSelectRole(r.role)}
                    role="button"
                    tabIndex={0}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.15rem',
                      padding: '1.25rem 1.35rem',
                      borderRadius: '14px',
                      background: isSelected ? `${r.color}12` : '#0F1217',
                      border: `1.5px solid ${isSelected ? r.color : 'rgba(255, 255, 255, 0.08)'}`,
                      boxShadow: isSelected ? `0 0 20px ${r.color}22` : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* Icon Box */}
                    <div style={{
                      width: 46,
                      height: 46,
                      borderRadius: '12px',
                      background: `${r.color}1c`,
                      color: r.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: `1px solid ${r.color}35`,
                    }}>
                      {r.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)' }}>
                          {r.label}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: `${r.color}20`,
                          color: r.color,
                          fontWeight: 600,
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {r.badge}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '0.84rem',
                        color: 'rgba(255, 255, 255, 0.55)',
                        lineHeight: 1.55,
                      }}>
                        {r.desc}
                      </p>
                    </div>

                    {/* Radio indicator */}
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? r.color : 'rgba(255, 255, 255, 0.25)'}`,
                      background: isSelected ? r.color : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}>
                      {isSelected && <Check size={14} color="#0B0D10" strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Step CTA */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                id="btn-goto-step-2"
                onClick={() => setStep(2)}
                className="btn btn-primary btn-lg"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '10px',
                  background: '#8FF075',
                  color: '#0B0D10',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(143, 240, 117, 0.3)',
                }}
              >
                Continue to Organisation Details <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ORGANISATION & ACCOUNT FORM */}
        {step === 2 && (
          <form onSubmit={handleRegister}>
            {/* Active Role Confirmation Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1.25rem',
              borderRadius: '12px',
              background: `${activeRoleConfig.color}15`,
              border: `1px solid ${activeRoleConfig.color}40`,
              marginBottom: '1.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: activeRoleConfig.color }}>
                  {activeRoleConfig.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Registering Account As
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                    {activeRoleConfig.label}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${activeRoleConfig.color}50`,
                  color: activeRoleConfig.color,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Change Role
              </button>
            </div>

            {/* Account Information Card */}
            <div style={{
              background: '#0F1217',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.75rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <User size={18} color="#8FF075" />
                <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: '#FFFFFF' }}>
                  Representative / Lead Account Details
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={13} /> Full Name <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    className="input-base"
                    placeholder="e.g. Priya Sharma"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-email" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={13} /> Corporate / Work Email <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    className="input-base"
                    placeholder="name@organisation.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-password" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Lock size={13} /> Password (min 6 chars) <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="input-base"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.4)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-phone" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={13} /> Mobile / WhatsApp Number
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    className="input-base"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Organisation Information Card */}
            <div style={{
              background: '#0F1217',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.75rem',
              marginBottom: '2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Building2 size={18} color="#00D2EF" />
                <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: '#FFFFFF' }}>
                  Organisation & Operating Facility
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {/* Org Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-org-name" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Briefcase size={13} /> Legal Entity / Facility Name <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    id="reg-org-name"
                    type="text"
                    required
                    className="input-base"
                    placeholder="e.g. The Leela Palace"
                    value={form.orgName}
                    onChange={e => setForm({ ...form, orgName: e.target.value })}
                  />
                </div>

                {/* Org Type */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-org-type">
                    Facility / Entity Category
                  </label>
                  <select
                    id="reg-org-type"
                    className="input-base"
                    value={form.orgType}
                    onChange={e => setForm({ ...form, orgType: e.target.value })}
                    style={{ background: '#12151A', color: '#E2E8F0' }}
                  >
                    <option value="hotel">Hospitality / Hotel</option>
                    <option value="restaurant">Restaurant / Commercial Kitchen</option>
                    <option value="market">Agricultural / APMC Wholesale Market</option>
                    <option value="housing_society">Residential Housing Society / RWA</option>
                    <option value="factory">Industrial Food Processing Plant</option>
                    <option value="recycler">Biochar Kiln / Biogas Recycling Facility</option>
                    <option value="logistics">Waste Collection Logistics Partner</option>
                    <option value="checker">Independent Verification Body</option>
                    <option value="buyer">Corporate ESG Offsetting Buyer</option>
                    <option value="municipality">Urban Local Body / Municipality</option>
                  </select>
                </div>

                {/* City */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-org-city" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={13} /> Operating City <span style={{ color: '#FF6B6B' }}>*</span>
                  </label>
                  <input
                    id="reg-org-city"
                    type="text"
                    required
                    className="input-base"
                    placeholder="e.g. Bengaluru"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                  />
                </div>

                {/* State */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-org-state">
                    State / Region
                  </label>
                  <input
                    id="reg-org-state"
                    type="text"
                    className="input-base"
                    placeholder="e.g. Karnataka"
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                  />
                </div>

                {/* GSTIN / Reg No */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="reg-org-gstin">
                    GSTIN / Corporate CIN (Optional, enables verified enterprise badge)
                  </label>
                  <input
                    id="reg-org-gstin"
                    type="text"
                    className="input-base"
                    placeholder="e.g. 29AABCT1332L1ZB"
                    value={form.gstin}
                    onChange={e => setForm({ ...form, gstin: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-ghost"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ArrowLeft size={16} /> Back to Role Selection
              </button>

              <button
                type="submit"
                id="register-submit-btn"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 2rem',
                  borderRadius: '10px',
                  background: '#8FF075',
                  color: '#0B0D10',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 0 25px rgba(143, 240, 117, 0.35)',
                }}
              >
                {loading ? (
                  <span>Registering & Verifying MRV...</span>
                ) : (
                  <>
                    Complete Registration <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
          Already have an active account or demo persona?{' '}
          <Link to="/login" style={{ color: '#8FF075', textDecoration: 'none', fontWeight: 600 }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
