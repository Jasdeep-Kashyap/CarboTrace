import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/lib/utils';
import { mockOrgs } from '@/lib/mock-data';
import {
  User, Building2, Shield, Bell, Trash2, Save,
  Camera, Check, AlertTriangle, Eye, EyeOff,
  Phone, Hash, Briefcase, LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: 'user' },
  { id: 'org',           label: 'Organisation',  icon: 'building' },
  { id: 'security',      label: 'Security',      icon: 'shield' },
  { id: 'notifications', label: 'Alerts',        icon: 'bell' },
  { id: 'danger',        label: 'Danger Zone',   icon: 'alert' },
] as const;

type TabId = typeof TABS[number]['id'];

const TAB_ICONS: Record<string, React.ReactNode> = {
  user: <User size={15} />,
  building: <Building2 size={15} />,
  shield: <Shield size={15} />,
  bell: <Bell size={15} />,
  alert: <AlertTriangle size={15} />,
};

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fg)', margin: '0 0 0.25rem' }}>{title}</h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}

function FieldRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-mono)' }}>
        {label}
      </label>
      <div style={{
        padding: '0.6rem 0.85rem', borderRadius: '10px',
        background: 'var(--surface-2)', border: '1px solid var(--border)',
        fontSize: '0.88rem', color: 'var(--fg)', fontWeight: 500,
      }}>
        {value || <span style={{ color: 'var(--fg-subtle)', fontStyle: 'italic' }}>Not set</span>}
      </div>
      {hint && <span style={{ fontSize: '0.72rem', color: 'var(--fg-subtle)' }}>{hint}</span>}
    </div>
  );
}

function ProfileTab() {
  const { profile } = useAuth();
  const [name, setName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    const stored = localStorage.getItem('carbotrace_custom_profile');
    if (stored) {
      try {
        const p = JSON.parse(stored);
        p.full_name = name.trim() || p.full_name;
        p.phone = phone.trim() || p.phone;
        localStorage.setItem('carbotrace_custom_profile', JSON.stringify(p));
      } catch { /* no-op */ }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const initials = (profile?.full_name ?? 'U').split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SectionHeader title="Profile Information" description="Your personal details shown across all CarboTrace portals." />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '18px',
            background: 'var(--accent-dim)', border: '2px solid rgba(143, 240, 117, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)',
            fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em',
          }}>{initials}</div>
          <button onClick={() => fileRef.current?.click()} style={{
            position: 'absolute', bottom: -4, right: -4,
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--accent)', border: '2px solid var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#000',
          }} title="Upload avatar"><Camera size={11} /></button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} />
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fg)' }}>{profile?.full_name}</div>
          <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginTop: '2px' }}>
            {ROLE_LABELS[profile?.role ?? 'generator']} Portal
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fg-subtle)', marginTop: '4px' }}>
            Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.875rem' }}>
        <FieldRow label="User ID" value={profile?.user_id ?? ''} hint="System-assigned, immutable" />
        <FieldRow label="Role" value={ROLE_LABELS[profile?.role ?? 'generator']} hint="Change role via Admin console" />
        <FieldRow label="Email" value={profile?.email ?? ''} hint="Used for login and notifications" />
        <FieldRow label="Account Status" value="Active & Verified" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.875rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-mono)' }}>Full Name</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-subtle)', display: 'flex' }}><User size={14} /></span>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={{ width: '100%', boxSizing: 'border-box', padding: '0.6rem 0.85rem 0.6rem 2.2rem', borderRadius: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: '0.88rem', color: 'var(--fg)', outline: 'none' }} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--fg-subtle)' }}>Displayed on all custody records</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-mono)' }}>Phone Number</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-subtle)', display: 'flex' }}><Phone size={14} /></span>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91-XXXXXXXXXX" style={{ width: '100%', boxSizing: 'border-box', padding: '0.6rem 0.85rem 0.6rem 2.2rem', borderRadius: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: '0.88rem', color: 'var(--fg)', outline: 'none' }} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--fg-subtle)' }}>Used for SMS alerts and payout confirmation</span>
        </div>
      </div>

      <div>
        <button onClick={handleSave} className="btn btn-primary" style={{ gap: '0.5rem', minWidth: 140 }}>
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

function OrgTab() {
  const { profile } = useAuth();
  const org = mockOrgs.find(o => o.id === profile?.org_id);

  if (!org) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <SectionHeader title="Organisation Details" description="Your registered organisation's profile and compliance info." />
        <div style={{ padding: '2rem', borderRadius: '12px', textAlign: 'center', background: 'var(--surface-2)', border: '1px dashed var(--border)' }}>
          <Building2 size={32} color="var(--fg-subtle)" style={{ marginBottom: '0.75rem' }} />
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.88rem', margin: 0 }}>No organisation linked to your profile. Contact your admin to associate an org.</p>
        </div>
      </div>
    );
  }

  const tierColors: Record<string, string> = { free: 'var(--fg-subtle)', basic: 'var(--blue)', pro: 'var(--accent)', enterprise: 'var(--amber)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SectionHeader title="Organisation Details" description="Your registered organisation's profile and compliance info." />
      <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--accent-dim)', border: '1px solid rgba(143,240,117,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
          <Building2 size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fg)' }}>{org.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--fg-muted)', marginTop: '2px' }}>{org.city}, {org.state}</div>
        </div>
        <div style={{ padding: '0.25rem 0.6rem', borderRadius: '999px', background: 'var(--surface-3)', border: '1px solid var(--border)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: tierColors[org.tier] ?? 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {org.tier}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.875rem' }}>
        <FieldRow label="Organisation ID" value={org.id} />
        <FieldRow label="Type" value={org.type.replace(/_/g, ' ')} />
        <FieldRow label="Contact Email" value={org.contact_email} />
        <FieldRow label="Contact Phone" value={org.contact_phone} />
        <FieldRow label="Address" value={org.address} />
        <FieldRow label="City / State" value={`${org.city}, ${org.state} — ${org.pincode}`} />
        <FieldRow label="GSTIN" value={org.gstin ?? 'Not provided'} hint="Required for GST-compliant payout" />
        <FieldRow label="Verified" value={org.verified ? '✓ Verified by Admin' : 'Pending Verification'} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {[
          { label: 'Total Waste', value: `${(org.total_waste_kg / 1000).toFixed(1)} t`, icon: <Trash2 size={14} /> },
          { label: 'CO₂e Avoided', value: `${(org.total_co2e_kg / 1000).toFixed(1)} t`, icon: <Briefcase size={14} /> },
          { label: 'Tier', value: org.tier.toUpperCase(), icon: <Hash size={14} /> },
        ].map(s => (
          <div key={s.label} style={{ padding: '0.875rem 1rem', borderRadius: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--fg-subtle)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{s.icon} {s.label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityTab() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function handleChange() {
    setError('');
    if (!current) { setError('Enter your current password.'); return; }
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (next !== confirm) { setError('Passwords do not match.'); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setCurrent(''); setNext(''); setConfirm('');
  }

  const strength = next.length === 0 ? 0 : next.length < 8 ? 1 : next.length < 12 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'var(--red)', 'var(--amber)', 'var(--accent)'];

  const inputStyle = { width: '100%', boxSizing: 'border-box' as const, padding: '0.6rem 2.5rem 0.6rem 0.85rem', borderRadius: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: '0.88rem', color: 'var(--fg)', outline: 'none' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SectionHeader title="Security Settings" description="Manage your password and authentication preferences." />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '10px', background: 'var(--accent-dim)', border: '1px solid rgba(143,240,117,0.25)' }}>
        <Check size={16} color="var(--accent)" />
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg)' }}>Session Active</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>Last sign-in: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: 400 }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>Change Password</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-mono)' }}>Current Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showCurrent ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} placeholder="••••••••" style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
            <button type="button" onClick={() => setShowCurrent(v => !v)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--fg-subtle)', cursor: 'pointer', padding: 0, display: 'flex' }}>{showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}</button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-mono)' }}>New Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showNext ? 'text' : 'password'} value={next} onChange={e => setNext(e.target.value)} placeholder="Min. 8 characters" style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
            <button type="button" onClick={() => setShowNext(v => !v)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--fg-subtle)', cursor: 'pointer', padding: 0, display: 'flex' }}>{showNext ? <EyeOff size={15} /> : <Eye size={15} />}</button>
          </div>
          {next.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '2px', alignItems: 'center' }}>
              {[1, 2, 3].map(i => (<div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= strength ? strengthColor[strength] : 'var(--border)', transition: 'background 0.2s' }} />))}
              <span style={{ fontSize: '0.68rem', color: strengthColor[strength], fontFamily: 'var(--font-mono)', marginLeft: '0.35rem', fontWeight: 600 }}>{strengthLabel[strength]}</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-mono)' }}>Confirm New Password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" style={{ ...inputStyle, padding: '0.6rem 0.85rem', border: `1px solid ${confirm && confirm !== next ? 'var(--red)' : 'var(--border)'}` }} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.currentTarget.style.borderColor = confirm && confirm !== next ? 'var(--red)' : 'var(--border)'; }} />
        </div>
        {error && <div style={{ fontSize: '0.8rem', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={13} /> {error}</div>}
        <button onClick={handleChange} className="btn btn-primary" style={{ gap: '0.5rem', alignSelf: 'flex-start' }}>
          {saved ? <><Check size={15} /> Password Updated</> : <><Shield size={15} /> Update Password</>}
        </button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({ sms_pickup: true, sms_payout: true, email_weekly: true, email_audit: true, push_alerts: false, whatsapp: false });
  const [saved, setSaved] = useState(false);

  function toggle(key: keyof typeof prefs) { setPrefs(p => ({ ...p, [key]: !p[key] })); }

  const items: { key: keyof typeof prefs; label: string; description: string; channel: string }[] = [
    { key: 'sms_pickup',   label: 'SMS: Pickup Confirmed',       description: 'Receive an SMS when your pickup request is accepted by a driver.',  channel: 'SMS' },
    { key: 'sms_payout',   label: 'SMS: Payout Released',        description: 'Get notified via SMS when ₹ payout is credited to your account.',   channel: 'SMS' },
    { key: 'email_weekly', label: 'Email: Weekly Impact Digest', description: 'A weekly summary of your CO₂e savings and credits minted.',          channel: 'Email' },
    { key: 'email_audit',  label: 'Email: Audit Status Update',  description: 'Receive email alerts when your batch moves through MRV review.',     channel: 'Email' },
    { key: 'push_alerts',  label: 'Browser Push Notifications',  description: 'Live in-browser alerts for custody events.',                         channel: 'Push' },
    { key: 'whatsapp',     label: 'WhatsApp Updates',            description: 'Receive key alerts on your registered WhatsApp number.',             channel: 'WhatsApp' },
  ];
  const channelColor: Record<string, string> = { SMS: 'var(--blue)', Email: 'var(--purple)', Push: 'var(--cyan)', WhatsApp: 'var(--accent)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SectionHeader title="Notification Preferences" description="Control how CarboTrace keeps you informed about custody events and payouts." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {items.map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', borderRadius: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--fg)' }}>{item.label}</span>
                <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', padding: '1px 5px', borderRadius: '4px', background: 'var(--surface-3)', color: channelColor[item.channel] ?? 'var(--fg-muted)', border: '1px solid var(--border)', fontWeight: 700 }}>{item.channel}</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--fg-muted)', lineHeight: 1.4 }}>{item.description}</div>
            </div>
            <button type="button" onClick={() => toggle(item.key)} role="switch" aria-checked={prefs[item.key]} style={{ width: 40, height: 22, borderRadius: 999, background: prefs[item.key] ? 'var(--accent)' : 'var(--surface-3)', border: `1px solid ${prefs[item.key] ? 'rgba(143,240,117,0.4)' : 'var(--border)'}`, cursor: 'pointer', padding: 0, position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <span style={{ position: 'absolute', top: 2, left: prefs[item.key] ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: prefs[item.key] ? '#000' : 'var(--fg-muted)', transition: 'left 0.2s' }} />
            </button>
          </div>
        ))}
      </div>
      <div>
        <button className="btn btn-primary" style={{ gap: '0.5rem' }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Preferences</>}
        </button>
      </div>
    </div>
  );
}

function DangerTab() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  function handleLogoutAll() { logout(); navigate('/login'); }
  function handleDeleteAccount() {
    if (confirmText !== 'DELETE') return;
    logout(); localStorage.clear(); navigate('/');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SectionHeader title="Danger Zone" description="Irreversible account actions. Proceed with caution." />
      <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--amber-dim)', border: '1px solid rgba(249,156,0,0.25)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' as const }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.2rem' }}>Sign Out of All Sessions</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--fg-muted)', lineHeight: 1.4 }}>Revoke all active sessions and sign out immediately on all devices.</div>
        </div>
        <button className="btn" onClick={handleLogoutAll} style={{ gap: '0.5rem', background: 'var(--amber-dim)', border: '1px solid var(--amber)', color: 'var(--amber)', fontWeight: 600, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <LogOut size={15} /> Sign Out All
        </button>
      </div>
      <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--red-dim)', border: '1px solid rgba(251,44,54,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' as const }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.2rem' }}>Delete Account</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--fg-muted)', lineHeight: 1.4 }}>Permanently delete your profile, remove you from all custody chains, and revoke all tokens. This cannot be undone.</div>
          </div>
          <button className="btn" onClick={() => setShowDeleteForm(v => !v)} style={{ gap: '0.5rem', background: 'var(--red-dim)', border: '1px solid var(--red)', color: 'var(--red)', fontWeight: 600, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Trash2 size={15} /> {showDeleteForm ? 'Cancel' : 'Delete Account'}
          </button>
        </div>
        {showDeleteForm && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(251,44,54,0.2)' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--fg-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              Type <strong style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>DELETE</strong> below to confirm:
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const }}>
              <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="Type DELETE" style={{ flex: 1, minWidth: 160, padding: '0.6rem 0.85rem', borderRadius: '10px', background: 'var(--surface-2)', border: '1px solid var(--red)', fontSize: '0.88rem', color: 'var(--fg)', outline: 'none', fontFamily: 'var(--font-mono)' }} />
              <button onClick={handleDeleteAccount} disabled={confirmText !== 'DELETE'} className="btn" style={{ gap: '0.5rem', background: confirmText === 'DELETE' ? 'var(--red)' : 'var(--red-dim)', border: '1px solid var(--red)', color: confirmText === 'DELETE' ? '#fff' : 'var(--red)', opacity: confirmText !== 'DELETE' ? 0.6 : 1, cursor: confirmText !== 'DELETE' ? 'not-allowed' : 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <Trash2 size={15} /> Permanently Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const { profile } = useAuth();

  return (
    <div className="page-content" style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '11px', background: 'var(--accent-dim)', border: '1px solid rgba(143,240,117,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <User size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fg)', margin: 0, letterSpacing: '-0.03em' }}>Account Management</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--fg-muted)', margin: 0, fontFamily: 'var(--font-mono)' }}>{profile?.email} · {ROLE_LABELS[profile?.role ?? 'generator']} Portal</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem', padding: '0.375rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
        {TABS.map(tab => {
          const isActive = tab.id === activeTab;
          const isDanger = tab.id === 'danger';
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.875rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: isActive ? 700 : 500, border: 'none', cursor: 'pointer', background: isActive ? (isDanger ? 'var(--red-dim)' : 'var(--surface-1)') : 'transparent', color: isActive ? (isDanger ? 'var(--red)' : 'var(--fg)') : isDanger ? 'var(--red)' : 'var(--fg-muted)', boxShadow: isActive ? 'var(--card-shadow)' : 'none', transition: 'all 0.15s' }}>
              {TAB_ICONS[tab.icon]} {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '1.5rem', borderRadius: '14px', background: 'var(--surface-1)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
        {activeTab === 'profile'       && <ProfileTab />}
        {activeTab === 'org'           && <OrgTab />}
        {activeTab === 'security'      && <SecurityTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'danger'        && <DangerTab />}
      </div>
    </div>
  );
}
