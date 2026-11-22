# CivicTechWR website: Astro demo

A working demo of the new CivicTechWR site, built with [Astro](https://astro.build) and edited with [Pages CMS](https://pagescms.org).
It covers the redesign's **Home**, **About**, **Projects** (plus a page for each project), **Get Involved**, **Resources** and **Blog** (list, tag pages, pagination and individual posts) pages.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

Requires Node 22.23 or later.

## How content is modelled

All the words on the site live in Pages CMS. The code decides how things look; the content files decide what they say.

| Pages CMS entry | File(s) | What it holds |
| --- | --- | --- |
| **Pages** | `src/content/pages/*.md` | Each page is a list of **sections**. Editors add, remove, reorder and edit sections. `home.md` is `/`, `blog.md` is `/blog/`, and any new page (say `about.md`) gets its own URL (`/about/`) with no code changes. |
| **Blog posts** | `src/content/blog/*.md` | Title, date, author, summary, tags, cover image and the post itself. Same files and names as Jekyll's `_posts`. |
| **Projects** | `src/content/projects/*.md` | One file per project, with its own page at `/projects/<file-name>/`. Card details, *Help wanted*, skills (for the filter buttons), *Active* (untick to move it to Past projects), problem and outcome, and a write-up. |
| **Project updates** | `src/content/updates/*.md` | Short weekly updates: pick the project, set the date, write the update. They list newest first at the bottom of the project's page. |
| **Site settings** | `_data/site.yml` | Header button, footer tagline, footer link columns, Luma calendar link, Open Collective page. |
| **Navigation menu** | `_data/navigation.yml` | Header links. |
| **This season** | `_data/season.yml` | Season name, current week, week-by-week phases, notes for upcoming nights. |
| **Partners** | `_data/partners.yml` | Unchanged from the current site; shown by the Partner logos section. |

### Section types

| Section | Use it for |
| --- | --- |
| Hero | The home page headline (up to 3 lines), intro, buttons and photo |
| Page title | The tilted title block at the top of an inner page, with an optional photo |
| Video and bullets | "What is CivicTechWR?" — video, text and up to 3 bullet points |
| Hacknight agenda + next event | The timeline (editable stops) beside the next Luma event, or beside a side card |
| Season tracker + upcoming nights | Text and photo, the 16-week tracker, and the next four Luma events |
| Projects that need help | Cards for projects with *Help wanted* skills |
| Photo gallery | A window of photos (used for Instagram) |
| Call to action band | Big heading, buttons and an optional side card |
| Text with a button | A heading, a paragraph and one button |
| Photo and text | General purpose: heading, big statement, list, rich text, photo left or right, buttons, and an optional side card |
| Text | General purpose: heading and rich text |
| Blog post list | The paginated list and tag filters (blog page only) |
| Cards | A grid of windows (documents, rules, Code of Conduct) or coloured tiles (Find your fit) |
| Project list | Active or past projects, with optional skill filters (`/projects/?skill=design`) |
| Numbered steps | "Got an idea? Pitch it" |
| Partner logos | Logos from the Partners file |
| Row of link buttons | "Elsewhere" |
| Season timeline | The 16-week tracker and what happens in each phase |

The **side card** (used by three sections) is one reusable window: heading, text, a list, a button, a note, and an optional extra, either the Open Collective **ledger** (balance, past year's income and backers, fetched when the site builds) or the **donate** form. Lists accept `**bold**` and `[links](/url)` and can use bullets, Memphis shapes, checkboxes or coloured squares.

Every section has a **Background** option (auto, cream, white, deep blue) and an optional **Anchor**, so links like `/about/#partners` jump to it. Design details — the colours of headline blocks and kicker tags, tilts, the Memphis shapes — follow fixed rules in `src/components/Sections.astro` and each section component, so an edit can't break the look.

### Validation

`src/content.config.ts` describes every field with a schema. If an edit doesn't fit (a missing heading, a fourth headline line, an unknown section type, an update whose project was renamed), the build stops and says exactly which page and field to fix, instead of publishing a broken page.

### Code map

| Where | What |
| --- | --- |
| `src/components/sections/` | One component per section type |
| `src/components/Sections.astro` | Renders a page's sections in order and applies the design rules |
| `src/components/` | Design-system components (Button, Window, EventCard, SeasonTracker, ProjectCard…) |
| `src/styles/` | `tokens.css` and `components.css` from the CivicTechWR design system; `site.css` for layout |
| `src/lib/luma.ts` | Upcoming hacknights from the Luma iCal feed at build time, with a fallback list |
| `src/lib/projects.ts` | Projects and their updates |
| `src/lib/opencollective.ts` | Open Collective figures at build time |
| `src/pages/projects/[slug].astro` | The project page template |
| `.pages.yml` | Pages CMS config, with reusable `button`, `link`, `image`, `card`, `background`, `anchor` and `list_style` components |

Interface labels that aren't content ("Read post", "Register on Luma", "Help wanted") stay in the components.

## Editing content

- **Change words on a page**: Pages → Home (or Blog) → open a section.
- **Add a page**: Pages → Add entry, give it a title and stack sections. Then add it to the Navigation menu.
- **Write a post**: Blog posts → Add entry. Leave *Summary* empty to use the first paragraph. Tick *Draft* to keep it off the site.
- **Each Wednesday**: This season → bump *Current week*. Project updates → Add entry for each team.
- **A project wraps up**: Projects → untick *Active* and fill in *Problem* and *Outcome*.

The next hacknight and the upcoming list come from Luma, so they update whenever the site rebuilds.

This demo lives on the `astro-demo` branch of `CivicTechWR/ctwr-web` and has no deploy workflow, so Pages CMS saves commit to the branch without publishing anything. Run `npm run build` locally to see edits.

## Not in this demo

- A weekly page listing every project's updates by date.
- A live Instagram feed (needs an API token at build time; the home page shows sample posts).
- The explainer video (placeholder).
