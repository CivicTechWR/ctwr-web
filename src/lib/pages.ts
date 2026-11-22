import { getEntry, getCollection } from 'astro:content';
import { allPosts } from './posts';

export async function page(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing page src/content/pages/${id}.md`);
  return entry.data;
}

// Pages other than home and blog (which have their own routes)
export async function otherPages() {
  return (await getCollection('pages')).filter((p) => p.id !== 'home' && p.id !== 'blog');
}

// Blog list settings come from the post_list section on the blog page.
export async function blogListing() {
  const blog = await page('blog');
  const list = blog.sections.find((s) => s.type === 'post_list');
  const size = list && list.type === 'post_list' ? list.page_size : 8;
  const posts = await allPosts();
  return { blog, size, posts, pages: Math.max(1, Math.ceil(posts.length / size)) };
}
