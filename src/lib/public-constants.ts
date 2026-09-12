// ─── All static deck content for the public landing page ──────────────────────
// Keeps PublicDashboard.tsx lean; edit content here.

export const INDIA_STATS = [
  {
    value: '#2',
    label: 'Globally in organic waste generation',
    sub: 'Behind China · Source: CPCB 2016',
    color: 'var(--red)',
  },
  {
    value: '1.6L',
    label: 'Tonnes / day urban MSW',
    sub: 'CPCB / SWM Rules 2016',
    color: 'var(--amber)',
  },
  {
    value: '55%',
    label: 'High-moisture organic fraction',
    sub: 'Ideal for biochar, biogas & carbon-negative materials',
    color: 'var(--cyan)',
  },
  {
    value: '<40%',
    label: 'Biochar / biogas capacity utilised',
    sub: 'Existing kilns & digestors underloaded',
    color: 'var(--accent)',
  },
] as const;

export const PLAYBOOK = [
  { step: '01', title: 'Segregate at Source',  desc: 'Separate organic waste (food, garden) from dry waste. Use dedicated green bins.', icon: '♻️' },
  { step: '02', title: 'Log on CarboTrace',    desc: 'Scan your bin QR code, upload an overhead photo, and request a pickup.', icon: '📱' },
  { step: '03', title: 'Verified Collection',  desc: 'Driver arrives within 50 m geofence, swaps bin, weighs waste — receipt sent via SMS.', icon: '🚛' },
  { step: '04', title: 'Recycler Processing',  desc: 'Waste is transformed via pyrolysis or biogas digestion. Lab tests validate yield.', icon: '🏭' },
  { step: '05', title: 'Carbon Credit Minted', desc: 'Auditor reviews all evidence → mints a W2C-YYYY-NNNNNN verified carbon credit.', icon: '✅' },
  { step: '06', title: 'Trade or Retire',      desc: 'Buyers purchase credits on the marketplace. Retire instantly for a climate certificate.', icon: '🌍' },
] as const;

export const FRICTION = [
  {
    index: '01',
    label: 'LOGISTICS INTEGRITY',
    title: 'Drivers Skipping Pickups or Taking Long Detours',
    issue: 'Contracted waste drivers skip scheduled pickups or take inefficient routes, burning unnecessary fuel and leaving perishable waste stranded.',
    solution: 'Automated Geofence Verification. The app automatically logs arrival and departure timestamps only when the driver\'s phone/vehicle GPS enters a 50-metre geofence of the pickup location, releasing payouts only for verified visits.',
  },
  {
    index: '02',
    label: 'HYGIENE COMPLIANCE',
    title: 'Dirty Bins and Foul Odour at Collection Sites',
    issue: 'Wet waste bins begin smelling within hours, attracting pests and making hotel kitchens or housing societies abandon the collection system.',
    solution: 'Bin-Swap System. The logistics team picks up the full bin and immediately replaces it with a pre-sanitised, empty bin rather than emptying and washing it on-site.',
  },
  {
    index: '03',
    label: 'QUALITY CONTROL',
    title: 'Mixed Waste in Segregated Bins',
    issue: 'Staff throw plastic bottles or cutlery into organic bins out of convenience, ruining the entire batch and reducing carbon-credit yield.',
    solution: 'Photo Check Before Pickup. The generator must upload a quick overhead photo of the open bin before booking a pickup; basic image scanning or driver verification flags non-segregated loads before the truck is dispatched.',
  },
  {
    index: '04',
    label: 'CUSTODY CHAIN',
    title: 'Weight Disagreements Between Sender and Receiver',
    issue: 'The waste generator claims they handed over 100 kg but the processing plant logs only 80 kg, leading to disputes over fees and carbon credits.',
    solution: 'Digital Weighbridge Handshake. Drivers carry a portable hook scale for small loads or pass through an automated weighbridge at the facility gate, generating a single tamperproof receipt sent instantly via SMS to both parties.',
  },
  {
    index: '05',
    label: 'OPERATIONS UX',
    title: 'Staff Forgetting Daily Pickup Requests',
    issue: 'Canteen or market workers forget to open the app and schedule waste dispatch during busy rush hours.',
    solution: 'Automated WhatsApp Reminders. A scheduled bot pings the facility manager at a fixed daily hour (e.g., 9:00 PM) asking for a quick reply ("Reply 1 for Full Bin, 2 for Half Bin"), automatically queueing next morning\'s route.',
  },
] as const;

export const REVENUE_LINES = [
  {
    label: 'Waste Marketplace Cut',
    rate: '5–8%',
    rateLabel: 'commission',
    desc: 'On every tonne of waste or biomass bought by biochar / biogas plants through the platform.',
    color: 'var(--accent)',
  },
  {
    label: 'Delivery Fee Margin',
    rate: '10–15%',
    rateLabel: 'of saved cost',
    desc: 'Of saved fuel and hauling costs from batched pickups and combined return trips.',
    color: 'var(--blue)',
  },
  {
    label: 'Monthly Compliance Fee',
    rate: '₹3k–10k',
    rateLabel: 'per month',
    desc: 'SaaS subscription for official waste receipts — protecting hotels, markets & factories from municipal fines.',
    color: 'var(--amber)',
  },
  {
    label: 'Carbon Credit Cut',
    rate: '15–20%',
    rateLabel: 'of sale value',
    desc: 'Of the W2C-verified credit value when sold on the marketplace or retired by corporate buyers.',
    color: 'var(--purple)',
  },
] as const;

// ₹26,500 per 100 t gross — from deck's worked example
// Generator share ≈ 40% (after platform + logistics margin)
// → ~₹106/t ≈ ₹100/t (rounded, labelled as estimate)
export const GENERATOR_RATE_INR_PER_TONNE = 100;
