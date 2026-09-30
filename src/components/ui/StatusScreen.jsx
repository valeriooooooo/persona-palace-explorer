// Full-width P5 style message while data loads or when the API is not running.
export function Loading({ what = 'Loading' }) {
  return (
    <div className="status-screen" role="status">
      <span className="status-screen__star" aria-hidden="true" />
      <p className="status-screen__text">{what}…</p>
    </div>
  )
}

export function ApiError({ error }) {
  return (
    <div className="status-screen status-screen--error" role="alert">
      <p className="status-screen__text">Can’t reach the database</p>
      <p className="status-screen__detail">{error.message}</p>
      <ol className="status-screen__steps">
        <li>
          Run <code>npm run db:setup</code> once to create the database.
        </li>
        <li>
          Start the site with <code>npm run dev</code> (starts the website and the API together).
        </li>
      </ol>
    </div>
  )
}
