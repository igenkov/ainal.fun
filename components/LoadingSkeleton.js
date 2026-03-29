export default function LoadingSkeleton() {
  return (
    <div className="skeleton-grid">
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="skeleton-pulse skeleton-label-block" />
          <div className="skeleton-pulse skeleton-line-long" />
          <div className="skeleton-pulse skeleton-line-medium" />
          <div className="skeleton-pulse skeleton-line-short" />
          <div className="skeleton-pulse skeleton-stars" />
        </div>
      ))}
    </div>
  )
}
