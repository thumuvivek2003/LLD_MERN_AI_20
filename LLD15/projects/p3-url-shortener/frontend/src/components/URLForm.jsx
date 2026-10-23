import { useState } from "react";

export default function URLForm({ onSubmit }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
  };

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <input
        className="url-form__input"
        type="text"
        placeholder="Paste a long URL to shorten…"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        aria-label="Long URL"
        autoComplete="off"
        spellCheck="false"
      />
      <button className="btn btn--primary" type="submit">
        Shorten
      </button>
    </form>
  );
}