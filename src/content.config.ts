import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog posts live in src/content/blog as Markdown, named YYYY-MM-DD-slug.md
// (the same names Jekyll used, so old files drop straight in).
// The URL drops the date: 2026-09-30-season-9-week-4.md -> /blog/season-9-week-4/
const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    season: z.number().optional(),
    week: z.number().optional(),
    discourse_url: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

// ---------- Pages: each page is a list of sections (Pages CMS "block" field) ----------
const link = z.object({ label: z.string(), url: z.string() });
const button = link.extend({ style: z.enum(['primary', 'secondary']).default('primary') });
// An empty src means "photo to come": the site shows a labelled placeholder.
const image = z.object({ src: z.string().optional().default(''), alt: z.string().default('') });
const heading = { kicker: z.string().optional(), heading: z.string() };
const optionalHeading = { kicker: z.string().optional(), heading: z.string().optional() };
// Every section can set a background and an anchor, so links like /about/#partners land on it.
const common = { background: z.enum(['auto', 'cream', 'white', 'deep']).default('auto'), anchor: z.string().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes').optional() };
// List items accept **bold** and [links](/url).
const items = z.array(z.string()).default([]);
export const LIST_STYLES = ['bullets', 'shapes', 'checks', 'squares'] as const;
const listStyle = z.enum(LIST_STYLES).default('bullets');
export const SKILLS = ['design', 'code', 'data', 'research', 'outreach'] as const;

// A retro window beside a section's text (Pages CMS "card" component).
const card = z.object({
  title: z.string().optional(),
  heading: z.string().optional(),
  body: z.string().optional(),
  items,
  list_style: listStyle,
  widget: z.enum(['none', 'ledger', 'donate']).default('none'),
  button: button.optional(),
  note: z.string().optional(),
});

const section = z.discriminatedUnion('type', [
  z.object({ type: z.literal('hero'), ...common, kicker: z.string().optional(), lines: z.array(z.string()).min(1).max(3), intro: z.string().optional(), buttons: z.array(button).default([]), image: image.optional() }),
  z.object({ type: z.literal('page_title'), ...common, kicker: z.string().optional(), heading: z.string(), intro: z.string().optional(), image: image.optional() }),
  z.object({ type: z.literal('explainer'), ...common, ...heading, body: z.string().optional(), bullets: z.array(z.string()).max(3).default([]),
    video: z.object({ title: z.string().optional(), url: z.string().optional(), poster: z.string().optional(), status: z.string().optional() }).optional() }),
  z.object({ type: z.literal('hack_night'), ...common, ...heading, intro: z.string().optional(), image: image.optional(), card: card.optional(), details: z.string().optional(), button: button.optional(),
    agenda: z.array(z.object({ time: z.string(), title: z.string(), text: z.string().optional(), icon: z.enum(['pizza', 'megaphone', 'list', 'laptop', 'flag', 'chat']).default('list'), optional: z.boolean().default(false) })).default([]) }),
  z.object({ type: z.literal('season'), ...common, ...heading, lead: z.string().optional(), body: z.string().optional(), link: link.optional(), image: image.optional(), caption: z.string().optional(), upcoming_heading: z.string().default('Coming up on Wednesdays') }),
  z.object({ type: z.literal('projects'), ...common, ...heading, button: link.optional(), limit: z.number().int().min(1).max(9).default(3) }),
  z.object({ type: z.literal('gallery'), ...common, ...heading, button: link.optional(), window_title: z.string().optional(), images: z.array(image).default([]), link: z.string().optional(), note: z.string().optional() }),
  z.object({ type: z.literal('cta'), ...common, heading: z.string(), body: z.string().optional(), buttons: z.array(button).default([]), card: card.optional() }),
  z.object({ type: z.literal('text_cta'), ...common, ...heading, body: z.string().optional(), button: button.optional() }),
  z.object({ type: z.literal('media_text'), ...common, ...heading, lead: z.string().optional(), items_heading: z.string().optional(), items, list_style: listStyle, body: z.string().optional(),
    image: image.optional(), image_side: z.enum(['left', 'right']).default('right'), card: card.optional(), buttons: z.array(button).default([]) }),
  z.object({ type: z.literal('text'), ...common, ...heading, body: z.string() }),
  z.object({ type: z.literal('post_list'), ...common, window_title: z.string().default('all_posts.txt'), page_size: z.number().int().min(1).default(8),
    filters: z.array(z.object({ label: z.string(), tag: z.string() })).default([]) }),
  z.object({ type: z.literal('cards'), ...common, ...optionalHeading, intro: z.string().optional(), style: z.enum(['window', 'tile']).default('window'), columns: z.number().int().min(2).max(4).default(3),
    cards: z.array(z.object({ title: z.string().optional(), tag: z.string().optional(), heading: z.string().optional(), body: z.string().optional(), items, note: z.string().optional(), link: link.optional(), highlight: z.boolean().default(false) })).default([]) }),
  z.object({ type: z.literal('project_list'), ...common, ...optionalHeading, intro: z.string().optional(), show: z.enum(['active', 'past']).default('active'), filters: z.boolean().default(false) }),
  z.object({ type: z.literal('steps'), ...common, ...heading, steps: z.array(z.object({ heading: z.string(), body: z.string().optional() })).default([]), buttons: z.array(button).default([]) }),
  z.object({ type: z.literal('partners'), ...common, ...heading, note: z.string().optional(), show_previous: z.boolean().default(false) }),
  z.object({ type: z.literal('links'), ...common, ...heading, links: z.array(link).default([]) }),
  z.object({ type: z.literal('season_timeline'), ...common, ...heading, intro: z.string().optional() }),
]);

// src/content/pages/home.md -> "/", blog.md -> "/blog/", about.md -> "/about/"
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sections: z.array(section).default([]),
  }),
});

// src/content/projects/waterloo-region-votes.md -> /projects/waterloo-region-votes/
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    status: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().optional(),
    url: z.string().optional(),
    github: z.string().optional(),
    year: z.array(z.number()).default([]),
    role: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    needs: z.array(z.string()).default([]),
    fund: z.string().optional(),
    skills: z.array(z.enum(SKILLS)).default([]),
    active: z.boolean().default(true),
    problem: z.string().optional(),
    outcome: z.string().optional(),
    order: z.number().default(100),
  }),
});

// Short weekly updates. `project` holds the project's name, as saved by the
// Pages CMS reference field; lib/projects.ts checks that the project exists.
const updates = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/updates' }),
  schema: z.object({
    project: z.string(),
    date: z.coerce.date(),
  }),
});

export type Section = z.infer<typeof section>;
export type Card = z.infer<typeof card>;
export type ListStyle = (typeof LIST_STYLES)[number];
export type Skill = (typeof SKILLS)[number];
export const collections = { blog, pages, projects, updates };
