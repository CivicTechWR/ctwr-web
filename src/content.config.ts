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
const bg = { background: z.enum(['auto', 'cream', 'white', 'deep']).default('auto') };

const section = z.discriminatedUnion('type', [
  z.object({ type: z.literal('hero'), ...bg, kicker: z.string().optional(), lines: z.array(z.string()).min(1).max(3), intro: z.string().optional(), buttons: z.array(button).default([]), image: image.optional() }),
  z.object({ type: z.literal('page_title'), ...bg, kicker: z.string().optional(), heading: z.string(), intro: z.string().optional(), image: image.optional() }),
  z.object({ type: z.literal('explainer'), ...bg, ...heading, body: z.string().optional(), bullets: z.array(z.string()).max(3).default([]),
    video: z.object({ title: z.string().optional(), url: z.string().optional(), poster: z.string().optional(), status: z.string().optional() }).optional() }),
  z.object({ type: z.literal('hack_night'), ...bg, ...heading, intro: z.string().optional(), image: image.optional(),
    agenda: z.array(z.object({ time: z.string(), title: z.string(), text: z.string().optional(), icon: z.enum(['pizza', 'megaphone', 'list', 'laptop', 'flag', 'chat']).default('list'), optional: z.boolean().default(false) })).default([]) }),
  z.object({ type: z.literal('season'), ...bg, ...heading, lead: z.string().optional(), body: z.string().optional(), link: link.optional(), image: image.optional(), caption: z.string().optional(), upcoming_heading: z.string().default('Coming up on Wednesdays') }),
  z.object({ type: z.literal('projects'), ...bg, ...heading, button: link.optional(), limit: z.number().int().min(1).max(9).default(3) }),
  z.object({ type: z.literal('gallery'), ...bg, ...heading, button: link.optional(), window_title: z.string().optional(), images: z.array(image).default([]), link: z.string().optional(), note: z.string().optional() }),
  z.object({ type: z.literal('cta'), ...bg, heading: z.string(), body: z.string().optional(), buttons: z.array(button).default([]),
    card: z.object({ title: z.string().optional(), heading: z.string(), body: z.string().optional(), button: button.optional() }).optional() }),
  z.object({ type: z.literal('text_cta'), ...bg, ...heading, body: z.string().optional(), button: button.optional() }),
  z.object({ type: z.literal('media_text'), ...bg, ...heading, body: z.string().optional(), image: image.optional(), image_side: z.enum(['left', 'right']).default('right'), buttons: z.array(button).default([]) }),
  z.object({ type: z.literal('text'), ...bg, ...heading, body: z.string() }),
  z.object({ type: z.literal('post_list'), ...bg, window_title: z.string().default('all_posts.txt'), page_size: z.number().int().min(1).default(8),
    filters: z.array(z.object({ label: z.string(), tag: z.string() })).default([]) }),
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

export type Section = z.infer<typeof section>;
export const collections = { blog, pages };
