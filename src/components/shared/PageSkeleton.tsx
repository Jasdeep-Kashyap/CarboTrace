export function PageSkeleton() {
  return (
    <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ height: 32, width: 240, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }} />
          <div style={{ height: 20, width: 320, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)' }} />
        </div>
        <div style={{ height: 36, width: 120, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }} />
      </div>
      
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card" style={{ height: 110, padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--color-surface-2)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 16, width: '60%', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem' }} />
                <div style={{ height: 12, width: '40%', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)' }} />
              </div>
            </div>
            <div style={{ height: 24, width: '50%', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }} />
          </div>
        ))}
      </div>
      
      <div className="card" style={{ height: 300 }}>
        <div style={{ height: 24, width: 180, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 40, width: '100%', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
