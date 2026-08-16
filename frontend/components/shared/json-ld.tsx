/**
 * Emits a JSON-LD block. Kept in one place so every schema on the site is
 * serialised the same way — and so the `<` escape (which stops a string value
 * from being able to close the script tag) is applied without fail.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
