import { useEffect } from 'react'

export default function PageMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = `${title} | PhishGuard AI`

    if (description) {
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', description)

      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', `${title} | PhishGuard AI`)

      const ogDescription = document.querySelector('meta[property="og:description"]')
      if (ogDescription) ogDescription.setAttribute('content', description)
    }
  }, [title, description])

  return null
}
