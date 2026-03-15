import URLForm from "../components/URLForm";
import ShortURLResult from "../components/ShortURLResult";
import { useShortenURL } from "../hooks/useShortenURL";
import AnalyticsPage from "./AnalyticsPage";

export default function HomePage() {

  const {
    shortURL,
    loading,
    error,
    generateShortURL
  } = useShortenURL();

  return (
    <div style={{ padding: "40px" }}>

      <h1>URL Shortener</h1>

      <URLForm onSubmit={generateShortURL} />

      {loading && <p>Generating...</p>}

      {error && <p>{error}</p>}

      {shortURL && (
        <ShortURLResult shortURL={shortURL} />
      )}

      <AnalyticsPage />

    </div>
  );
}