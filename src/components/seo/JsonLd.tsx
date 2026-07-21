/**
 * Renders a JSON-LD structured-data block.
 *
 * `JSON.stringify` does NOT escape `<`, `>` or `&`, so any string in `data`
 * that contains `</script>` (e.g. AI-generated blog titles pulled from external
 * news) would otherwise break out of this <script> element into live HTML — a
 * stored-XSS sink. Escaping those characters to their `\uXXXX` JSON forms keeps
 * the JSON semantically identical while making script breakout impossible.
 * See OWASP XSS Prevention Cheat Sheet, "JSON in HTML context".
 */
function serializeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
