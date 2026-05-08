import { useState } from 'react';
import { COLORS } from '@shared/constants/colors';

interface Props {
  src: string;
  alt: string;
}

export function ImageWithFallback({ src, alt }: Props) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: COLORS.primary, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 14,
      }}>
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ maxWidth: '80%', maxHeight: 36, objectFit: 'contain' }}
      onError={() => setError(true)}
    />
  );
}
