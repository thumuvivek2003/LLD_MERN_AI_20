import { useEffect, useRef } from 'react';

export function OtpInput({ value = '', onChange, length = 6 }) {
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  function setAt(i, ch) {
    const arr = value.split('');
    while (arr.length < length) arr.push('');
    arr[i] = ch;
    onChange(arr.join('').slice(0, length));
  }

  function handleChange(e, i) {
    const ch = e.target.value.replace(/[^0-9]/g, '').slice(-1);
    setAt(i, ch);
    if (ch && i < length - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  }

  function handleKeyDown(e, i) {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (!text) return;
    e.preventDefault();
    onChange(text.slice(0, length));
    const focusIdx = Math.min(text.length, length - 1);
    inputsRef.current[focusIdx]?.focus();
  }

  return (
    <div className="flex gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-10 rounded border border-wa-border text-center text-lg font-semibold outline-none focus:border-wa-primary focus:ring-1 focus:ring-wa-primary"
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}
