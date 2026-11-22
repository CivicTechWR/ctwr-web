// Rich-text fields from Pages CMS are saved as HTML. Plain text (hand-edited
// YAML) is wrapped in a paragraph so both render the same way.
export const rich = (v?: string) => {
  if (!v) return '';
  const t = v.trim();
  return /^<(p|ul|ol|h\d|div|blockquote)[\s>]/i.test(t) ? t : t.split(/\n\s*\n/).map((p) => `<p>${p}</p>`).join('');
};
// Multi-line plain text (e.g. a heading with a line break) -> lines
export const lines = (v: string) => v.split('\n').map((l) => l.trim()).filter(Boolean);
