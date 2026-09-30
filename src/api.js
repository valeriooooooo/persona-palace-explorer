import { useEffect, useState } from 'react'

// Data comes from the database through the API in server/index.js.
function useApi(path) {
  const [state, setState] = useState({ path: null, data: null, error: null })

  useEffect(() => {
    let alive = true
    fetch(path)
      .then(async (res) => {
        const body = await res.json().catch(() => null)
        if (!res.ok) throw new Error(body?.error ?? `API error ${res.status}`)
        return body
      })
      .then((data) => alive && setState({ path, data, error: null }))
      .catch((error) => alive && setState({ path, data: null, error }))
    return () => {
      alive = false
    }
  }, [path])

  // Ignore results of an older request while a new one is loading.
  return state.path === path ? state : { data: null, error: null }
}

export const usePalaces = () => useApi('/api/palaces')
export const usePalace = (slug) => useApi(`/api/palaces/${encodeURIComponent(slug)}`)

// Image paths are stored relative to public/images and may contain spaces.
export const imageUrl = (path) => (path ? `/images/${encodeURI(path)}` : null)
