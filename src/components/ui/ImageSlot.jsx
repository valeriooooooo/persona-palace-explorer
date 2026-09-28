import { useState } from 'react'

// Shows /public/images/<src>. Until that file exists, renders a halftone
// placeholder that names the file to add.
export default function ImageSlot({ src, alt, className = '' }) {
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
    <div className={`image-slot ${className}`}>
      <img src={`/images/${src}`} alt={alt} onError={() => setFailedSrc(src)} />
    </div>
  )
}
