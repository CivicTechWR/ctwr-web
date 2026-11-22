// Rich-text fields from Pages CMS are saved as HTML. Plain text (hand-edited
// YAML) is wrapped in a paragraph so both render the same way.
export const rich = (v?: string) => {
  if (!v) return '';
  const t = v.trim();
  return /^<(p|ul|ol|h\d|div|blockquote)[\s>]/i.test(t) ? t : t.split(/\n\s*\n/).map((p) => `<p>${p}</p>`).join('');
};
// One-line text (list items): escapes HTML, then allows **bold** and [links](/url).
export const inline = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
// Multi-line plain text (e.g. a heading with a line break) -> lines
export const lines = (v: string) => v.split('\n').map((l) => l.trim()).filter(Boolean);
