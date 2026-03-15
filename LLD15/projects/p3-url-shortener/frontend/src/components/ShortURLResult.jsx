import { copyToClipboard } from "../utils/copyToClipboard";

export default function ShortURLResult({ shortURL }) {
  const handleCopy = () => {
    copyToClipboard(shortURL);
  };

  return (
    <div className="short-url-result">
      <div>
        <p className="short-url-result__label">Your short link</p>
        <a
          className="short-url-result__link"
          href={shortURL}
          target="_blank"
          rel="noreferrer"
        >
          {shortURL}
        </a>
      </div>

      <button className="btn btn--ghost btn--sm" onClick={handleCopy}>
        Copy
      </button>
    </div>
  );
}