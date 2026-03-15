import URLForm from "../components/URLForm";
import ShortURLResult from "../components/ShortURLResult";
import AnalyticsPage from "./AnalyticsPage";
import { useShortenURL } from "../hooks/useShortenURL";

export default function HomePage() {
  const { shortURL, loading, error, generateShortURL } = useShortenURL();

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="page-header">
        <div className="badge badge--accent">URL Shortener</div>
        <h1 style={{ marginTop: "var(--space-4)" }}>
          Shorten any link,<br />share with confidence.
        </h1>
        <p style={{ marginTop: "var(--space-3)" }}>
          Paste a long URL and get a clean, trackable short link instantly.
        </p>
      </header>

      {/* Form */}
      <URLForm onSubmit={generateShortURL} />

      {/* Status feedback */}
      {loading && (
        <div className="status status--loading">Generating your link…</div>
      )}
      {error && (
        <div className="status status--error">{error}</div>
      )}

      {/* Result */}
      {shortURL && <ShortURLResult shortURL={shortURL} />}

      {/* Divider */}
      <div className="divider" />

      {/* Analytics */}
      <AnalyticsPage />
    </div>
  );
}