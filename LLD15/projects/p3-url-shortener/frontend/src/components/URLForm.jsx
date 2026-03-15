import { useState } from "react";

export default function URLForm({ onSubmit }) {

  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url) return;

    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Enter long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button type="submit">
        Shorten
      </button>

    </form>
  );
}