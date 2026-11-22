import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Update = CollectionEntry<'updates'>;

export const projectHref = (p: Project) => `/projects/${p.id}/`;

export async function allProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

// Newest first. Fails the build if an update points at a project that doesn't exist.
export async function allUpdates(): Promise<Update[]> {
  const names = new Set((await getCollection('projects')).map((p) => p.data.name));
  const updates = await getCollection('updates');
  for (const u of updates) {
    if (!names.has(u.data.project)) {
      throw new Error(`Project update src/content/updates/${u.id}.md is linked to "${u.data.project}", but no project has that name. Open the update in Pages CMS and pick its project again.`);
    }
  }
  return updates.sort((a, b) => +b.data.date - +a.data.date || a.id.localeCompare(b.id));
}

export async function updatesFor(project: Project): Promise<Update[]> {
  return (await allUpdates()).filter((u) => u.data.project === project.data.name);
}
