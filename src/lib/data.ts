// Reads the YAML files in /_data. Pages CMS edits these files directly,
// so their shape matches the "content" entries in .pages.yml.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

function load<T>(name: string): T {
  const file = path.join(process.cwd(), '_data', `${name}.yml`);
  return yaml.load(fs.readFileSync(file, 'utf8')) as T;
}

export type NavItem = { text: string; url: string };
export type Project = {
  name: string;
  description?: string;
  summary?: string;
  logo?: string;
  url?: string;
  github?: string;
  year?: number[];
  role?: string[];
  tags?: string[];
  status?: string;
  needs?: string[];
  fund?: string;
};
export type Phase = 'pitch' | 'ideation' | 'planning' | 'build' | 'user' | 'finish' | 'prep' | 'showcase';
export type Season = {
  name: string;
  current_week: number;
  weeks: Phase[];
  notes?: { week: number; text: string }[];
};

export const navigation = () => load<NavItem[]>('navigation');
export const projects = () => load<Project[]>('projects');
export const season = () => load<Season>('season');

export const PHASES: Record<Phase, string> = {
  pitch: 'Pitch night',
  ideation: 'Ideation & scoping',
  planning: 'Project planning & team formation',
  build: 'Design & build',
  user: 'User testing',
  finish: 'Finish building',
  prep: 'Showcase prep',
  showcase: 'Project showcase',
};

type Link = { label: string; url: string };
export type Site = {
  header_button: Link;
  footer: { tagline: string; button: Link; groups: { title: string; links: Link[] }[]; copyright: string; badge?: string };
  luma_calendar: string;
};
export const site = () => load<Site>('site');
