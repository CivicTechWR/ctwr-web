// Latest @civictechwr posts, fetched once at build time. Photos are saved
// locally because Instagram's image URLs expire. If the token is missing or
// the API fails, callers fall back to the sample photos in the CMS.
// Rebuild the site on a schedule (see .github/workflows/deploy.yml) to keep it fresh.

import fs from 'node:fs/promises';
import path from 'node:path';
import { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID } from 'astro:env/server';

// Professional account for @civictechwr. Override with INSTAGRAM_USER_ID.
const USER_ID = INSTAGRAM_USER_ID || '17841410261291521';
const GRAPH = 'https://graph.facebook.com/v27.0';
const ALLOWED_HOST = /(^|\.)cdninstagram\.com$|(^|\.)fbcdn\.net$/;

export type InstagramPost = { src: string; alt: string; href: string; text?: string };

type Media = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
};

function token() {
  const value = INSTAGRAM_ACCESS_TOKEN?.trim();
  return value || undefined;
}

function safe(message: string) {
  return message.replace(/access_token=[^&\s]+/g, 'access_token=…');
}

async function graph<T>(pathname: string, params: Record<string, string>): Promise<T> {
  const url = new URL(GRAPH + pathname);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set('access_token', token()!);
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const body = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok || body.error) throw new Error(body.error?.message || `HTTP ${res.status}`);
  return body;
}

function picture(media: Media) {
  return media.media_type === 'VIDEO' ? media.thumbnail_url : media.media_url || media.thumbnail_url;
}

async function remoteImage(media: Media) {
  const direct = picture(media);
  if (direct) return direct;
  if (media.media_type !== 'CAROUSEL_ALBUM') return;
  const children = await graph<{ data?: Media[] }>(`/${media.id}/children`, {
    fields: 'media_type,media_url,thumbnail_url',
    limit: '1',
  });
  const first = children.data?.[0];
  return first ? picture(first) : undefined;
}

function cleanCaption(caption?: string) {
  const text = caption?.replace(/\s+/g, ' ').trim();
  return text || undefined;
}

export function captionAlt(caption?: string) {
  const text = cleanCaption(caption);
  if (!text) return 'Photo posted by CivicTechWR on Instagram';
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  const space = cut.lastIndexOf(' ');
  return `${(space > 80 ? cut.slice(0, space) : cut).trimEnd()}...`;
}

// Shown under the photo. CSS clamps it to a few lines, so this stays a snippet.
export function captionSnippet(caption?: string) {
  const text = cleanCaption(caption);
  if (!text) return;
  if (text.length <= 180) return text;
  const cut = text.slice(0, 180);
  const space = cut.lastIndexOf(' ');
  return (space > 80 ? cut.slice(0, space) : cut).trimEnd();
}

function extension(type: string) {
  if (type.includes('png')) return 'png';
  if (type.includes('webp')) return 'webp';
  return 'jpg';
}

// Dev serves public/. The production build copies public/ before pages render,
// so build-time photos are written straight into dist/.
function imageDir() {
  return path.join(process.cwd(), import.meta.env.PROD ? 'dist' : 'public', 'instagram');
}

async function saveImage(id: string, remote: string) {
  if (!/^\d+$/.test(id)) return;
  let remoteUrl: URL;
  try {
    remoteUrl = new URL(remote);
  } catch {
    return;
  }
  if (remoteUrl.protocol !== 'https:' || !ALLOWED_HOST.test(remoteUrl.hostname)) return;

  const res = await fetch(remoteUrl, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) return;
  const finalHost = new URL(res.url).hostname;
  const type = res.headers.get('content-type') ?? '';
  if (!ALLOWED_HOST.test(finalHost) || !type.startsWith('image/')) return;
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length < 100) return;

  const filename = `${id}.${extension(type)}`;
  const file = path.join(imageDir(), filename);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, bytes);
  await fs.rename(tmp, file);
  return `/instagram/${filename}`;
}

async function load(count: number): Promise<InstagramPost[]> {
  if (!token()) {
    console.warn('[instagram] No INSTAGRAM_ACCESS_TOKEN; showing the sample photos.');
    return [];
  }
  const dir = imageDir();
  if (import.meta.env.PROD) await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });

  const page = await graph<{ data?: Media[] }>(`/${USER_ID}/media`, {
    fields: 'id,caption,media_type,media_url,thumbnail_url,permalink',
    limit: String(Math.max(count, 8)),
  });

  const posts: InstagramPost[] = [];
  for (const media of page.data ?? []) {
    if (posts.length >= count) break;
    if (!media.permalink) continue;
    const remote = await remoteImage(media);
    if (!remote) continue;
    const src = await saveImage(media.id, remote);
    if (!src) continue;
    posts.push({ src, alt: captionAlt(media.caption), href: media.permalink, text: captionSnippet(media.caption) });
  }
  if (!posts.length) throw new Error('no displayable posts');
  return posts;
}

let cache: Promise<InstagramPost[]> | undefined;

export function latestInstagramPosts(count = 4): Promise<InstagramPost[]> {
  cache ??= load(count).catch((error) => {
    console.warn(`[instagram] Using sample photos (${safe((error as Error).message)})`);
    return [];
  });
  return cache.then((posts) => posts.slice(0, count));
}
