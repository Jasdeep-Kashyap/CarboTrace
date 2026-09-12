import {
  pickupStatusColor, auditStatusColor, creditStatusColor,
} from '@/lib/utils';

type StatusType = 'pickup' | 'audit' | 'credit' | 'batch' | 'route' | 'order' | 'dispute';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  label?: string;
}

const PICKUP_LABELS: Record<string, string> = {
  draft:          'Draft',
  photo_pending:  'Photo Pending',
  photo_verified: 'Photo Verified',
  queued:         'Queued',
  assigned:       'Assigned',
  en_route:       'En Route',
  arrived:        'Arrived',
  weighed:        'Weighed',
  completed:      'Completed',
  cancelled:      'Cancelled',
  flagged:        'Flagged',
};

const AUDIT_LABELS: Record<string, string> = {
  pending:    'Pending',
  in_review:  'In Review',
  approved:   'Approved',
  rejected:   'Rejected',
  needs_info: 'Needs Info',
};

const CREDIT_LABELS: Record<string, string> = {
  minted:    'Minted',
  listed:    'Listed',
  sold:      'Sold',
  retired:   'Retired',
  cancelled: 'Cancelled',
};

const BATCH_LABELS: Record<string, string> = {
  in_transit: 'In Transit',
  received:   'Received',
  processing: 'Processing',
  processed:  'Processed',
  rejected:   'Rejected',
};

const DISPUTE_LABELS: Record<string, string> = {
  open:         'Open',
  under_review: 'Under Review',
  resolved:     'Resolved',
  dismissed:    'Dismissed',
};

function getColor(status: string, type: StatusType): string {
  if (type === 'pickup') return pickupStatusColor(status);
  if (type === 'audit')  return auditStatusColor(status);
  if (type === 'credit') return creditStatusColor(status);
  if (type === 'batch') {
    const m: Record<string, string> = { in_transit: 'blue', received: 'teal', processing: 'amber', processed: 'green', rejected: 'red' };
    return m[status] ?? 'gray';
  }
  if (type === 'dispute') {
    const m: Record<string, string> = { open: 'red', under_review: 'amber', resolved: 'green', dismissed: 'gray' };
    return m[status] ?? 'gray';
  }
  return 'gray';
}

function getLabel(status: string, type: StatusType, label?: string): string {
  if (label) return label;
  if (type === 'pickup')  return PICKUP_LABELS[status]  ?? status;
  if (type === 'audit')   return AUDIT_LABELS[status]   ?? status;
  if (type === 'credit')  return CREDIT_LABELS[status]  ?? status;
  if (type === 'batch')   return BATCH_LABELS[status]   ?? status;
  if (type === 'dispute') return DISPUTE_LABELS[status] ?? status;
  return status;
}

export function StatusBadge({ status, type = 'pickup', label }: StatusBadgeProps) {
  const color = getColor(status, type);
  const text  = getLabel(status, type, label);

  return (
    <span className={`badge badge-${color}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {text}
    </span>
  );
}
