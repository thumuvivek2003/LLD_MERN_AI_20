export default function MovieBanner({ movie }) {
  return (
    <div style={{ position: 'relative', height: 320, background: '#1a1a2e', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
      {movie.bannerUrl && (
        <img src={movie.bannerUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
      )}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 32, background: 'linear-gradient(to top, #0f0f1a 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
          <div style={{ width: 120, height: 180, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '2px solid #2a2a3e' }}>
            {movie.posterUrl
              ? <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🎬</div>
            }
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{movie.title}</h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              {movie.genre?.map(g => <span key={g} style={{ fontSize: 12, padding: '2px 10px', background: '#e5091422', color: '#e50914', borderRadius: 20 }}>{g}</span>)}
            </div>
            <p style={{ color: '#a0a0b0', fontSize: 14 }}>{movie.duration} min • {movie.language} • ★ {movie.rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
