import { useState } from 'react';
import { Button } from '../../../shared/components/Button.jsx';

export function MessageInput({ onSend, onKeystroke, disabled }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
    onKeystroke?.();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-wa-border bg-wa-light px-3 py-2"
    >
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type a message"
        disabled={disabled}
        className="flex-1 rounded-full bg-white px-4 py-2 text-sm shadow-sm outline-none focus:ring-1 focus:ring-wa-primary"
      />
      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={disabled || !text.trim()}
        className="rounded-full"
      >
        Send
      </Button>
    </form>
  );
}
