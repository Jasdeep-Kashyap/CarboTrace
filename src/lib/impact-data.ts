// ─── Impact & Methodology Data Models ──────────────────────────────────────────
// Authoritative sources:
// - IPCC 2019 Refinement to 2006 Guidelines for National GHG Inventories (Vol 5: Waste)
// - US EPA WARM (Waste Reduction Model) v16 (2023)
// - ISO 14064-2:2019 MRV Protocol for Project-Level GHG Quantification
// - CPCB (Central Pollution Control Board) MSW Technical Guidance (2024)
// - European Biochar Certificate (EBC) / Puro.earth Carbon Removal Standards
// - US EPA GHG Equivalencies Calculator (2024)

export type TimeframeScope = 'all' | 'fy26' | '90d';

export interface SourceCitation {
  id: string;
  shortName: string;
  fullName: string;
  issuingBody: string;
  standardCode: string;
  year: number;
  url: string;
  methodologySummary: string;
  formula: string;
  verificationMethod: string;
}

export interface MetricImpactItem {
  id: string;
  title: string;
  value: number;
  unit: string;
  formattedDisplay: string;
  delta: string;
  color: string;
  badge: string;
  description: string;
  citationId: string;
}

export interface WasteStreamImpact {
  type: string;
  label: string;
  sharePercent: number;
  divertedKg: number;
  co2eAvoidedKg: number;
  methanePreventedKg: number;
  color: string;
  primaryDestination: string;
}

export interface ProcessingMethodImpact {
  key: string;
  name: string;
  divertedTons: number;
  yieldProduct: string;
  yieldOutput: string;
  co2eRemovalFactor: string; // e.g. "0.85 tCO2e / ton"
  carbonSinkPermanence: string; // e.g. "100+ years"
  citationId: string;
}

export interface RegionalImpact {
  region: string;
  state: string;
  partnerOrgs: number;
  wasteDivertedTons: number;
  co2eAvoidedTons: number;
  alleviatedLandfill: string;
  leachatePreventedLitres: number;
}

// ─── Source Citations Directory ──────────────────────────────────────────────
export const SOURCE_CITATIONS: Record<string, SourceCitation> = {
  'ipcc-2019-vol5': {
    id: 'ipcc-2019-vol5',
    shortName: 'IPCC (2019 Refinement Vol 5)',
    fullName: '2019 Refinement to the 2006 IPCC Guidelines for National Greenhouse Gas Inventories: Volume 5 (Waste)',
    issuingBody: 'Intergovernmental Panel on Climate Change (IPCC)',
    standardCode: 'IPCC-FOD-WST-2019',
    year: 2019,
    url: 'https://www.ipcc-nggip.iges.or.jp/public/2019rf/vol5.html',
    methodologySummary: 'First Order Decay (FOD) model parameterizing degradation rates (k=0.17 for tropical wet waste) and methane generation potential (Lo = 0.08 tCH4/t waste). Calculates fugitive methane avoided when diverted from unmanaged dump sites.',
    formula: 'E_avoided = W_diverted × DOC × DOC_f × F × 16/12 × (1 - OX) × GWP_CH4 (where GWP_CH4 = 28)',
    verificationMethod: 'Calibrated weighbridge receipts cross-referenced against regional decay kinetics.',
  },
  'epa-warm-v16': {
    id: 'epa-warm-v16',
    shortName: 'US EPA WARM v16 (2023)',
    fullName: 'United States Environmental Protection Agency Waste Reduction Model (WARM) Version 16',
    issuingBody: 'US EPA Office of Resource Conservation and Recovery',
    standardCode: 'EPA-530-R-23-004',
    year: 2023,
    url: 'https://www.epa.gov/warm',
    methodologySummary: 'Comprehensive life-cycle emissions and carbon sinks associated with organic materials management. Benchmarks landfill methane displacement, process emissions, soil carbon restoration, and synthetic fertilizer displacement.',
    formula: 'Net_CO2e = (Baseline_Landfill_Emissions + Transport_Baseline) - (Project_Processing_Emissions + Transport_Project - Soil_Carbon_Sink)',
    verificationMethod: 'Life-cycle assessment (LCA) boundary verified via ISO 14044 and batch processing logs.',
  },
  'iso-14064-2': {
    id: 'iso-14064-2',
    shortName: 'ISO 14064-2:2019',
    fullName: 'Greenhouse gases — Part 2: Specification with guidance at the project level for quantification, monitoring and reporting of GHG emission reductions or removal enhancements',
    issuingBody: 'International Organization for Standardization (ISO)',
    standardCode: 'ISO 14064-2:2019',
    year: 2019,
    url: 'https://www.iso.org/standard/66454.html',
    methodologySummary: 'Defines additionality, project baseline scenarios, monitoring protocols, and verification checkpoints for verified carbon credit issuance under serial number format W2C-YYYY-NNNNNN.',
    formula: 'Credit_Issued = Verified_Avoided_Emissions + Carbon_Removal - Leakage_Deduction - Buffer_Reserve (5%)',
    verificationMethod: 'Third-party accredited Checker auditing pickup photos, PostGIS geofencing (50m), and weighbridge digital slips.',
  },
  'cpcb-msw-2024': {
    id: 'cpcb-msw-2024',
    shortName: 'CPCB Guidelines (2024)',
    fullName: 'Central Pollution Control Board Guidelines on Environmental Management of Dumpsites & Municipal Solid Waste Handling',
    issuingBody: 'Ministry of Environment, Forest and Climate Change (MoEFCC), Govt. of India',
    standardCode: 'CPCB/MSW/WM-IV/2024',
    year: 2024,
    url: 'https://cpcb.nic.in',
    methodologySummary: 'Empirical analysis of toxic leachate generation (average 220–280 liters per metric ton of wet organic MSW in tropical landfill environments) and heavy metal percolation rates to unconfined groundwater aquifers.',
    formula: 'Leachate_Prevented = Diverted_Wet_Organic_Tons × 250 L/ton (Mean tropical generation coefficient)',
    verificationMethod: 'Weighbridge input records combined with waste categorization moisture-content assays.',
  },
  'puro-biochar-2023': {
    id: 'puro-biochar-2023',
    shortName: 'Puro.earth / EBC Biochar Standard',
    fullName: 'Puro Standard: Biochar Methodology Edition 2023 & European Biochar Certificate (EBC)',
    issuingBody: 'Puro.earth Carbon Removal Standard & EBC Consortium',
    standardCode: 'PURO-CORC-BIOCHAR-2023',
    year: 2023,
    url: 'https://puro.earth/biochar-methodology',
    methodologySummary: 'Strict quantification of permanent carbon removal through biomass thermochemical conversion (pyrolysis). Validates that biochar with H:Corg ratio < 0.7 sequesters >75% of elemental carbon for at least 100 years in soil and aggregate applications.',
    formula: 'Net_CORC = Dry_Biochar_Yield × Total_Organic_C% × Carbon_Stability_Factor (82%) × 44/12 - LifeCycle_Energy_Burden',
    verificationMethod: 'Third-party accredited laboratory GC-MS and elemental analyzer reports attached to each batch audit queue.',
  },
  'epa-equivalencies-2024': {
    id: 'epa-equivalencies-2024',
    shortName: 'EPA GHG Equivalencies (2024)',
    fullName: 'United States EPA Greenhouse Gas Equivalencies Calculator Mathematical Factors',
    issuingBody: 'US EPA Clean Energy Programs',
    standardCode: 'EPA-GHG-EQ-2024',
    year: 2024,
    url: 'https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator',
    methodologySummary: 'Standardised societal equivalence coefficients: 1 metric ton of CO₂e = 2,482 miles driven by an average gasoline passenger vehicle (0.21 kg CO₂/km); 16.5 urban tree seedlings grown for 10 years (approx 21.7 kg CO₂ absorbed per tree-year).',
    formula: 'Car_Km = (tCO2e × 1000) / 0.21 | Urban_Trees = (tCO2e × 1000) / 21.77',
    verificationMethod: 'Direct linear translation from certified net tCO₂e avoided.',
  },
};

// ─── Scope Data ───────────────────────────────────────────────────────────────
export interface PlatformScopeData {
  timeframeLabel: string;
  periodDescription: string;
  totalWasteKg: number;
  totalCO2eAvoidedKg: number;
  methanePreventedKg: number;
  permanentCarbonSequesteredKg: number;
  leachatePreventedLitres: number;
  creditsMinted: number;
  creditsRetired: number;
  cleanEnergyGeneratedKwh: number;
  driverWagesDisbursedInr: number;
  registeredOrgs: number;
  verifiedPickupsCount: number;
  metrics: MetricImpactItem[];
}

export const PLATFORM_IMPACT_DATA: Record<TimeframeScope, PlatformScopeData> = {
  all: {
    timeframeLabel: 'All Time (Village Pilot Inception)',
    periodDescription: 'Cumulative mock metrics for a small rural village cluster (~142 farming households & local dairy co-op)',
    totalWasteKg: 38_500, // 38.5 metric tons
    totalCO2eAvoidedKg: 15_400, // 15.4 tCO2e
    methanePreventedKg: 550, // 550 kg of fugitive CH4
    permanentCarbonSequesteredKg: 3_200, // 3.2 tons biochar carbon sink
    leachatePreventedLitres: 9_625, // 9,625 liters toxic leachate
    creditsMinted: 26,
    creditsRetired: 18,
    cleanEnergyGeneratedKwh: 6_540, // renewable power/biogas from village digester
    driverWagesDisbursedInr: 58_400, // direct micro-payouts to rural waste collectors
    registeredOrgs: 14, // local village entities, SHGs, school, dairy unit
    verifiedPickupsCount: 280,
    metrics: [
      {
        id: 'waste-diverted',
        title: 'Village & Farm Waste Diverted',
        value: 38.5,
        unit: 'tons',
        formattedDisplay: '38.5 t',
        delta: 'Mock Village Data',
        color: '#8FF075',
        badge: 'Zero-Landfill Village Pilot',
        description: 'Household food scraps, cattle dung slurry, and crop stubble intercepted before open field dumping.',
        citationId: 'ipcc-2019-vol5',
      },
      {
        id: 'co2e-avoided',
        title: 'Net Avoided GHG Emissions',
        value: 15.4,
        unit: 'tCO₂e',
        formattedDisplay: '15.4 tCO₂e',
        delta: 'Simulated Value',
        color: '#00D2EF',
        badge: 'ISO 14064-2 Methodology',
        description: 'Methane and field-burning emissions prevented, calculated via EPA WARM and IPCC parameters.',
        citationId: 'epa-warm-v16',
      },
      {
        id: 'permanent-removal',
        title: 'Permanent Village Biochar C-Sink',
        value: 3.2,
        unit: 'tC',
        formattedDisplay: '3.2 tC',
        delta: 'Puro Standard',
        color: '#AC4BFF',
        badge: '100-Year Soil Carbon',
        description: 'Biomass converted in community retort kilns and reapplied to enrich village farming soil.',
        citationId: 'puro-biochar-2023',
      },
      {
        id: 'methane-stopped',
        title: 'Fugitive Methane (CH₄) Abated',
        value: 0.55,
        unit: 'tons CH₄',
        formattedDisplay: '550 kg CH₄',
        delta: 'GWP-100 = 28x',
        color: '#F99C00',
        badge: 'Short-Lived Pollutant',
        description: 'Decomposition methane trapped and channeled into clean village household cooking gas.',
        citationId: 'ipcc-2019-vol5',
      },
      {
        id: 'leachate-prevented',
        title: 'Village Pond Leachate Protected',
        value: 9625,
        unit: 'Litres',
        formattedDisplay: '9,625 L',
        delta: 'Aquifer Safety',
        color: '#3B82F6',
        badge: 'Groundwater Safeguard',
        description: 'Prevented dirty percolation from roadside dumping into village borewells and irrigation ponds.',
        citationId: 'cpcb-msw-2024',
      },
      {
        id: 'economic-payouts',
        title: 'Rural Collector Direct Payouts',
        value: 58400,
        unit: 'INR',
        formattedDisplay: '₹58,400',
        delta: 'Direct Micro-payouts',
        color: '#10B981',
        badge: 'Fair Rural Wages',
        description: 'Instant supplemental income transferred to village e-cart drivers and self-help group collectors.',
        citationId: 'iso-14064-2',
      },
    ],
  },
  fy26: {
    timeframeLabel: 'Fiscal Year 2025–26 (YTD)',
    periodDescription: 'YTD simulated mock run across participating panchayat wards and smallholding farms',
    totalWasteKg: 24_200,
    totalCO2eAvoidedKg: 9_680,
    methanePreventedKg: 345,
    permanentCarbonSequesteredKg: 2_100,
    leachatePreventedLitres: 6_050,
    creditsMinted: 16,
    creditsRetired: 11,
    cleanEnergyGeneratedKwh: 4_120,
    driverWagesDisbursedInr: 36_500,
    registeredOrgs: 9,
    verifiedPickupsCount: 185,
    metrics: [
      {
        id: 'waste-diverted',
        title: 'Village & Farm Waste Diverted',
        value: 24.2,
        unit: 'tons',
        formattedDisplay: '24.2 t',
        delta: 'Mock Village Data',
        color: '#8FF075',
        badge: 'Zero-Landfill Village Pilot',
        description: 'Fiscal year diversion across village kitchen bins, local weekly haat, and farm residue.',
        citationId: 'ipcc-2019-vol5',
      },
      {
        id: 'co2e-avoided',
        title: 'Net Avoided GHG Emissions',
        value: 9.68,
        unit: 'tCO₂e',
        formattedDisplay: '9.7 tCO₂e',
        delta: 'Simulated Value',
        color: '#00D2EF',
        badge: 'ISO 14064-2 Methodology',
        description: 'Avoided open decomposition emissions independently computed per EPA WARM factors.',
        citationId: 'epa-warm-v16',
      },
      {
        id: 'permanent-removal',
        title: 'Permanent Village Biochar C-Sink',
        value: 2.1,
        unit: 'tC',
        formattedDisplay: '2.1 tC',
        delta: 'Puro Standard',
        color: '#AC4BFF',
        badge: '100-Year Soil Carbon',
        description: 'Biochar blended with compost for local crop plots, retaining moisture and nutrients.',
        citationId: 'puro-biochar-2023',
      },
      {
        id: 'methane-stopped',
        title: 'Fugitive Methane (CH₄) Abated',
        value: 0.35,
        unit: 'tons CH₄',
        formattedDisplay: '345 kg CH₄',
        delta: 'GWP-100 = 28x',
        color: '#F99C00',
        badge: 'Short-Lived Pollutant',
        description: 'Methane abatement achieved through swift aerobic composting and anaerobic gobar biogas.',
        citationId: 'ipcc-2019-vol5',
      },
      {
        id: 'leachate-prevented',
        title: 'Village Pond Leachate Protected',
        value: 6050,
        unit: 'Litres',
        formattedDisplay: '6,050 L',
        delta: 'Aquifer Safety',
        color: '#3B82F6',
        badge: 'Groundwater Safeguard',
        description: 'Protected open water catchment reservoirs from monsoon toxic runoff.',
        citationId: 'cpcb-msw-2024',
      },
      {
        id: 'economic-payouts',
        title: 'Rural Collector Direct Payouts',
        value: 36500,
        unit: 'INR',
        formattedDisplay: '₹36,500',
        delta: 'Direct Micro-payouts',
        color: '#10B981',
        badge: 'Fair Rural Wages',
        description: 'Transparent micro-payments to local collection youth upon weight verification.',
        citationId: 'iso-14064-2',
      },
    ],
  },
  '90d': {
    timeframeLabel: 'Last 90 Days (Trailing Quarter)',
    periodDescription: 'Quarterly simulated mock data for localized pilot operations',
    totalWasteKg: 8_500,
    totalCO2eAvoidedKg: 3_400,
    methanePreventedKg: 121,
    permanentCarbonSequesteredKg: 750,
    leachatePreventedLitres: 2_125,
    creditsMinted: 6,
    creditsRetired: 4,
    cleanEnergyGeneratedKwh: 1_450,
    driverWagesDisbursedInr: 12_800,
    registeredOrgs: 5,
    verifiedPickupsCount: 65,
    metrics: [
      {
        id: 'waste-diverted',
        title: 'Village & Farm Waste Diverted',
        value: 8.5,
        unit: 'tons',
        formattedDisplay: '8.5 t',
        delta: 'Mock Village Data',
        color: '#8FF075',
        badge: 'Zero-Landfill Village Pilot',
        description: 'Recent 90-day pilot cycle intake across primary ward collection points.',
        citationId: 'ipcc-2019-vol5',
      },
      {
        id: 'co2e-avoided',
        title: 'Net Avoided GHG Emissions',
        value: 3.4,
        unit: 'tCO₂e',
        formattedDisplay: '3.4 tCO₂e',
        delta: 'Simulated Value',
        color: '#00D2EF',
        badge: 'ISO 14064-2 Methodology',
        description: 'Net quarterly carbon emissions mitigated from rural open dumping.',
        citationId: 'epa-warm-v16',
      },
      {
        id: 'permanent-removal',
        title: 'Permanent Village Biochar C-Sink',
        value: 0.75,
        unit: 'tC',
        formattedDisplay: '0.75 tC',
        delta: 'Puro Standard',
        color: '#AC4BFF',
        badge: '100-Year Soil Carbon',
        description: 'Small-batch high-temp pyrolysis char output delivered to local nurserybeds.',
        citationId: 'puro-biochar-2023',
      },
      {
        id: 'methane-stopped',
        title: 'Fugitive Methane (CH₄) Abated',
        value: 0.12,
        unit: 'tons CH₄',
        formattedDisplay: '121 kg CH₄',
        delta: 'GWP-100 = 28x',
        color: '#F99C00',
        badge: 'Short-Lived Pollutant',
        description: 'Short-term climate warming averted by avoiding uncontrolled heap fermentation.',
        citationId: 'ipcc-2019-vol5',
      },
      {
        id: 'leachate-prevented',
        title: 'Village Pond Leachate Protected',
        value: 2125,
        unit: 'Litres',
        formattedDisplay: '2,125 L',
        delta: 'Aquifer Safety',
        color: '#3B82F6',
        badge: 'Groundwater Safeguard',
        description: 'Groundwater filtration preserved around community handpumps.',
        citationId: 'cpcb-msw-2024',
      },
      {
        id: 'economic-payouts',
        title: 'Rural Collector Direct Payouts',
        value: 12800,
        unit: 'INR',
        formattedDisplay: '₹12,800',
        delta: 'Direct Micro-payouts',
        color: '#10B981',
        badge: 'Fair Rural Wages',
        description: 'Earned by community green warriors over 65 verified collection runs.',
        citationId: 'iso-14064-2',
      },
    ],
  },
};

// ─── Waste Streams Breakdown (Village Scale) ──────────────────────────────────
export const WASTE_STREAM_BREAKDOWN: WasteStreamImpact[] = [
  {
    type: 'food_wet',
    label: 'Village Kitchen & Haat Wet Scraps',
    sharePercent: 40,
    divertedKg: 15_400,
    co2eAvoidedKg: 6_468,
    methanePreventedKg: 220,
    color: '#8FF075',
    primaryDestination: 'Village Biogas Plant & Pyrolysis Retort',
  },
  {
    type: 'agricultural',
    label: 'Farm Crop Residue & Mustard Stubble',
    sharePercent: 35,
    divertedKg: 13_475,
    co2eAvoidedKg: 4_177,
    methanePreventedKg: 192,
    color: '#00D2EF',
    primaryDestination: 'Decentralized Farm Retort Kilns (Biochar)',
  },
  {
    type: 'cattle_dung',
    label: 'Cattle Dung & Dairy By-products',
    sharePercent: 15,
    divertedKg: 5_775,
    co2eAvoidedKg: 3_176,
    methanePreventedKg: 87,
    color: '#F99C00',
    primaryDestination: 'Community Gobar Biogas Digester',
  },
  {
    type: 'garden',
    label: 'Village Green Foliage & Tree Trimmings',
    sharePercent: 10,
    divertedKg: 3_850,
    co2eAvoidedKg: 1_579,
    methanePreventedKg: 51,
    color: '#3B82F6',
    primaryDestination: 'Panchayat Aerobic Compost Pits',
  },
];

// ─── Processing Methodologies (Village Pilot) ─────────────────────────────────
export const PROCESSING_METHODS_IMPACT: ProcessingMethodImpact[] = [
  {
    key: 'pyrolysis',
    name: 'Decentralized Biochar Retorts',
    divertedTons: 18.5,
    yieldProduct: 'Class-1 High-Carbon Biochar (C > 78%)',
    yieldOutput: '5.55 t local biochar',
    co2eRemovalFactor: '0.85 tCO₂e net sink per ton feedstock',
    carbonSinkPermanence: '> 100 Years (Puro / EBC Certified)',
    citationId: 'puro-biochar-2023',
  },
  {
    key: 'anaerobic_digestion',
    name: 'Community Gobar / Biogas Digester',
    divertedTons: 12.0,
    yieldProduct: 'Piped Biogas Cooking Fuel & Nutrient Slurry',
    yieldOutput: '6,540 kWh equivalent clean cooking heat',
    co2eRemovalFactor: '0.33 tCO₂e avoided per ton feedstock',
    carbonSinkPermanence: 'Displaces firewood & fossil LPG cylinders',
    citationId: 'epa-warm-v16',
  },
  {
    key: 'composting',
    name: 'Ward Vermicompost & Aerobic Pits',
    divertedTons: 8.0,
    yieldProduct: 'Humic Organic Fertilizer for Village Crops',
    yieldOutput: '3.2 t nutrient compost',
    co2eRemovalFactor: '0.18 tCO₂e avoided per ton feedstock',
    carbonSinkPermanence: 'Replaces chemical urea & DAP fertilizers',
    citationId: 'ipcc-2019-vol5',
  },
];

// ─── Regional Geographic Footprint (Village Clusters) ─────────────────────────
export const REGIONAL_IMPACTS: RegionalImpact[] = [
  {
    region: 'Kolar Dairy & Agri Hamlet',
    state: 'Karnataka',
    partnerOrgs: 5,
    wasteDivertedTons: 15.2,
    co2eAvoidedTons: 6.08,
    alleviatedLandfill: 'Village Roadside Open Dump Pile',
    leachatePreventedLitres: 3_800,
  },
  {
    region: 'Shirur Farmer Cluster',
    state: 'Maharashtra',
    partnerOrgs: 4,
    wasteDivertedTons: 11.8,
    co2eAvoidedTons: 4.72,
    alleviatedLandfill: 'Riverbank Waste Heap & Field Burning',
    leachatePreventedLitres: 2_950,
  },
  {
    region: 'Nuh Rural Panchayat Ward',
    state: 'Haryana',
    partnerOrgs: 3,
    wasteDivertedTons: 7.5,
    co2eAvoidedTons: 3.0,
    alleviatedLandfill: 'Village Pond Margin Dumping Site',
    leachatePreventedLitres: 1_875,
  },
  {
    region: 'Medak Agro Cooperative',
    state: 'Telangana',
    partnerOrgs: 2,
    wasteDivertedTons: 4.0,
    co2eAvoidedTons: 1.6,
    alleviatedLandfill: 'Irrigation Canal Edge Discard',
    leachatePreventedLitres: 1_000,
  },
];

// ─── Real-World Societal Equivalencies Helper (Village Context) ────────────────
export function computeEquivalencies(co2eKg: number) {
  const tCO2e = co2eKg / 1000;
  return [
    {
      label: 'Motorcycle & Rural Vehicle Trips Displaced',
      value: Math.round(co2eKg / 0.12),
      formatted: Math.round(co2eKg / 0.12).toLocaleString('en-IN') + ' km',
      icon: '🛵',
      source: 'ARAI & US EPA (0.12 kg CO₂ / km 2-wheeler/e-rickshaw)',
      citationId: 'epa-equivalencies-2024',
    },
    {
      label: 'Village Trees Seedlings Nurtured (10 Yrs)',
      value: Math.round(tCO2e * 16.5),
      formatted: Math.round(tCO2e * 16.5).toLocaleString('en-IN') + ' trees',
      icon: '🌳',
      source: 'US Forest Service & EPA (16.5 seedlings grown 10 yrs per tCO₂e)',
      citationId: 'epa-equivalencies-2024',
    },
    {
      label: 'Village Household Days of Clean Biogas',
      value: Math.round(tCO2e * 32.4 * 25),
      formatted: Math.round(tCO2e * 32.4 * 25).toLocaleString('en-IN') + ' family days',
      icon: '🔥',
      source: 'MoP&NG Rural Energy Equivalent (Displacing firewood / dung cakes)',
      citationId: 'epa-warm-v16',
    },
    {
      label: 'Rural Homes Powered by Solar / Biogas',
      value: Math.max(1, Math.round((co2eKg / 0.71) / 360)), // 30 kWh/mo for small rural home
      formatted: Math.max(1, Math.round((co2eKg / 0.71) / 360)).toLocaleString('en-IN') + ' homes / yr',
      icon: '💡',
      source: 'CEA India Rural Domestic Baseline (0.71 kg CO₂/kWh)',
      citationId: 'cpcb-msw-2024',
    },
    {
      label: 'Village Pond Surface Area Preserved',
      value: Math.round(tCO2e * 3.5),
      formatted: Math.round(tCO2e * 3.5).toLocaleString('en-IN') + ' m² area',
      icon: '💧',
      source: 'CPCB Dumpsite Leachate Dispersion Area model',
      citationId: 'cpcb-msw-2024',
    },
    {
      label: 'Smartphones Charged Equivalent',
      value: Math.round(tCO2e * 121_643),
      formatted: Math.round(tCO2e * 121_643).toLocaleString('en-IN') + ' charges',
      icon: '📱',
      source: 'EPA GHG Model (121,643 mobile phone charges per tCO₂e)',
      citationId: 'epa-equivalencies-2024',
    },
  ];
}
