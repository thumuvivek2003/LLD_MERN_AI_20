import { copyToClipboard } from "../utils/copyToClipboard";

export default function ShortURLResult({ shortURL }) {

  const handleCopy = () => {
    copyToClipboard(shortURL);
    alert("Copied to clipboard!");
  };

  return (
    <div>

      <p>
        Short URL:
        <a href={shortURL} target="_blank" rel="noreferrer">
          {shortURL}
        </a>
      </p>

      <button onClick={handleCopy}>
        Copy
      </button>

    </div>
  );
}