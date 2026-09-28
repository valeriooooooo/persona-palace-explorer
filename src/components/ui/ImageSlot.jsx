import { useState } from 'react'

// Shows /public/images/<src>. Until that file exists, renders a halftone
// placeholder that names the file to add.
// `fit` ('cover' | 'contain') and `position` tune how the image is cropped.
export default function ImageSlot({ src, alt, className = '', fit = 'cover', position = 'center' }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const missing = !src || failedSrc === src

  if (missing) {
    return (
      <div className={`image-slot image-slot--empty ${className}`} role="img" aria-label={alt}>
        <span className="image-slot__hint">
          {src ? <>Add image:<br /><code>public/images/{src}</code></> : 'No image'}
        </span>
      </div>
    )
  }

  return (
    <div className={`image-slot image-slot--${fit} ${className}`}>
      <img
        src={`/images/${src}`}
        alt={alt}
        style={{ objectFit: fit, objectPosition: position }}
        onError={() => setFailedSrc(src)}
      />
    </div>
  )
}
