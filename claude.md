# CivicTech Waterloo Region - Claude Code Project Guide

**Project:** CivicTechWR Jekyll Website
**Branch:** perf/perf-improvements
**Last Updated:** October 15, 2025
**Tech Stack:** Jekyll, HTML, CSS, JavaScript, Bootstrap 4.1.3
**Current Branch:** perf/bootstrap-optimization

---

## Project Overview

CivicTechWR is a community organization website built with Jekyll. The site focuses on:
- Promoting weekly hacknight events
- Showcasing civic tech projects
- Building community engagement in the Waterloo Region
- Providing resources and documentation for members

**Live Site:** https://civictechwr.org
**Primary Audience:** Tech enthusiasts, designers, civic-minded individuals in Kitchener-Waterloo

---

## Current Status & Known Issues

### Critical Issues Identified (October 2025)

**Performance Problems:**
- **200+ MB Chrome memory usage** (target: <50MB)
- Large asset sizes: 800KB total CSS/JS (target: <100KB)
- Font Awesome 6.4.0: 320KB loaded, only ~15 icons used
- Bootstrap: 295KB loaded, ~25% utilized
- jQuery: 85KB loaded, only 2 features used

**Code Quality Issues:**
- **64 instances of `!important`** declarations (CSS specificity wars)
- **7 different button style systems** (inconsistent UX)
- **Duplicate footer implementations** (root vs _includes)
- **2,252 lines of CSS** with significant duplication
- **180+ lines of inline styles** in index.html duplicating style.css

**Style Inconsistencies:**
- 4 different link color schemes across the site
- 5 different border-radius values used inconsistently
- 3 different hover effect patterns
- Hard-coded colors mixed with CSS variables

### Recent Audit Findings

See `docs/AUDIT_REPORT.md` for complete performance audit results.

---

## Current Work in Progress (October 15, 2025)

### ✅ Completed - Foundation Fixes

The following critical fixes have been completed:

1. **Removed duplicate CSS definitions** (commit a5d7ada)
   - Deleted `.github-btn` duplicate from `css/pages/projects.css`
   - Removed 3 CSS `<link>` tags from `_includes/header.html` (causing FOUC)

2. **Fixed hardcoded event dates** (commit f8586db)
   - Replaced hardcoded Thursday dates with dynamic Wednesday calculation
   - Added `getNextDayOfWeek()` function in `js/optimized-bundle.js`
   - Regenerated minified bundle via `npm run minify:optimized`

3. **Removed 10.1KB of unused critical CSS**
   - Deleted `critical.css`, `critical-inline.css`, `critical-optimized.css`

4. **Created unified meeting section component**
   - Created `_includes/meeting-section.html` with parametrizable `section_id`
   - Replaced 162 lines of duplicate HTML across index.html, about.html, projects.html

5. **Created unified button system** (staged, not yet committed)
   - Created `css/components/buttons.css` (380 lines, ZERO `!important` declarations)
   - Uses BEM methodology (btn--primary, btn--secondary, btn--outline, etc.)
   - Loaded in all 3 main HTML pages (index.html, about.html, projects.html)

### 🚧 In Progress - Button System Migration

**Status:** Foundation complete, HTML migration pending

**Files staged for commit:**
- `css/components/buttons.css` (new file)
- `index.html` (loads button CSS on line 57)
- `about.html` (loads button CSS on line 49)
- `projects.html` (loads button CSS on line 49)

**Remaining Work:**

#### Step 1: Update HTML to use new BEM button classes
Use the **web-design-specialist** agent to systematically update button classes:

**Migration mapping:**
- `class="btn btn-primary"` → `class="btn btn--primary"`
- `class="btn btn-outline"` → `class="btn btn--outline"`
- `class="btn btn-outline btn-light-inverse"` → `class="btn btn--light"`
- `class="github-btn btn"` → `class="btn btn--badge"`
- `class="btn btn-primary meeting-btn"` → `class="btn btn--meeting"`
- `class="footer-donate-btn"` → `class="btn btn--donate"`
- `class="footer-sponsor-btn"` → `class="btn btn--footer"`
- `class="footer-general-btn"` → `class="btn btn--footer"`

**Files requiring updates (29 button instances total):**
1. `index.html` - 9 buttons (lines 110, 114, 115-117, 118, 199, 226, 227, 235, 252)
2. `about.html` - 2 buttons (line 65)
3. `projects.html` - 6 buttons (lines 66, 151, 195 - including 4 JavaScript-generated)
4. `_includes/header.html` - 1 button (line 32)
5. `_includes/footer.html` - 5 buttons (lines 11, 14, 28, 42, 43)
6. `_includes/meeting-section.html` - 1 button (line 47)

**Agent to use:**
```bash
# Launch web-design-specialist to perform systematic button class updates
# The agent has already analyzed all files and created a detailed migration plan
# Ask it to execute the migration with exact search-and-replace operations
```

#### Step 2: Remove old button CSS from style.css
Use the **code-reviewer** agent to identify and remove legacy button definitions:

**Old button classes to remove from `css/style.css` (17+ definitions with `!important`):**
- Line 702: `.btn` (base)
- Lines 333-351: `.navbar .custom-btn`
- Lines 353-365: `.custom-btn`
- Lines 367-377: `.custom-border-btn`
- Lines 379-388: `.btn.custom-link` (with `!important`)
- Lines 390-405: `.btn.meeting-btn` (with `!important`)
- Lines 795-806: `.footer-donate-btn`
- Lines 809-820: `.footer-sponsor-btn`
- Lines 823-835: `.footer-general-btn`
- Lines 923-932: `.btn-primary`
- Lines 934-945: `.btn-outline`
- Lines 948-957: `.btn.btn-primary` (with `!important`)
- Lines 959-971: `.btn.btn-outline` (with `!important`)
- Lines 973-983: `.btn.btn-outline.btn-light-inverse` (with `!important`)
- Lines 1251-1263: `.meeting-btn`
- Lines 1348-1362: `.btn.meeting-btn-alt` (with `!important`)
- Lines 1496-1501: `.github-btn`

**Expected results:**
- Removal of ~150-200 lines of CSS
- Elimination of button-related `!important` declarations (majority of 64 instances)
- 5-10KB reduction in style.css file size

#### Step 3: Test all pages
**Manual testing checklist:**
- [ ] All buttons render with correct visual styles
- [ ] Hover states work properly (no `!important` conflicts)
- [ ] Focus states show accessibility indicators
- [ ] Buttons maintain correct sizing on mobile (responsive breakpoints)
- [ ] No console errors from missing CSS classes
- [ ] Footer buttons maintain correct spacing and icons
- [ ] GitHub badge buttons display correctly on project cards
- [ ] Meeting section button on teal background (red coral color)

**Browser testing:**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### Step 4: Commit the complete button system
```bash
git add css/components/buttons.css index.html about.html projects.html _includes/header.html _includes/footer.html _includes/meeting-section.html css/style.css
git commit -m "feat: Consolidate 7 button systems into unified BEM system

- Create css/components/buttons.css with BEM methodology
- ZERO !important declarations (eliminates CSS specificity wars)
- Update all 29 button instances across 6 files to use new classes
- Remove 17+ old button definitions from style.css (~150-200 lines)
- Maintains visual parity with existing design
- Estimated 5-10KB CSS reduction

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 📋 Next Immediate Tasks

After button system completion, prioritize these tasks:

1. **Remove remaining `!important` declarations** (~40-50 left in style.css)
   - Use **code-reviewer** agent to identify all instances
   - Fix specificity issues properly instead of using `!important`

2. **Standardize link colors** (4 different schemes currently)
   - Audit all link styles in style.css
   - Consolidate to single color system using CSS variables

3. **Remove inline styles from index.html** (180+ lines duplicating style.css)
   - Use **web-design-specialist** to identify duplicates
   - Move to appropriate CSS files or remove

---

## Architecture

### File Structure

```
ctwr-web/
├── _includes/           # Jekyll partials
│   ├── header.html     # Site navigation (✓ canonical)
│   └── footer.html     # Site footer (✓ canonical)
├── _data/              # YAML data files
│   ├── projects.yml    # Featured projects
│   ├── partners.yml    # Sponsor information
│   └── navigation.yml  # Navigation links
├── css/
│   ├── style.css       # Main styles (2,252 lines - needs optimization)
│   ├── critical.css    # Above-fold styles (has duplicates)
│   ├── bootstrap.css   # Bootstrap 4.1.3 (155KB - needs PurgeCSS)
│   └── [other CSS]
├── js/
│   ├── jquery.js       # jQuery 3.x (85KB - candidate for removal)
│   ├── custom.js       # Site interactions (31 lines)
│   └── meeting.js      # Meetup API integration
├── images/             # Site images (WebP + JPG fallbacks)
├── index.html          # Homepage
├── about.html          # About page
├── projects.html       # Projects listing
├── footer.html         # ⚠️ DUPLICATE - should be deleted
└── _config.yml         # Jekyll configuration
```

### CSS Architecture

**Current State (Problematic):**
- All styles in single 2,252-line `style.css`
- Inline critical CSS in `index.html` (duplicates style.css)
- `critical.css` duplicates content from `style.css`
- Multiple competing button systems
- Extensive use of `!important` for specificity battles

**Recommended Structure:**
```
css/
├── base/
│   ├── variables.css      # CSS custom properties
│   ├── reset.css          # Normalize/reset
│   └── typography.css     # Text styles
├── components/
│   ├── buttons.css        # Unified button system
│   ├── footer.css         # Footer styles
│   ├── header.css         # Navigation styles
│   └── cards.css          # Card components
├── layout/
│   ├── grid.css           # Layout system
│   └── sections.css       # Section spacing
└── style.css              # Main import file
```

---

## CSS Custom Properties (Design Tokens)

### Current Variables

```css
:root {
  /* Brand Colors */
  --white-color: #fff;
  --primary-color: #FC6C6D;      /* Red/coral - accent */
  --secondary-color: #2D6F72;     /* Teal - brand primary */
  --dark-color: #000;
  --p-color: #717275;             /* Body text gray */

  /* Layout */
  --section-bg-color: #f9f9f9;
  --border-color: #e9eaeb;

  /* Typography */
  --body-font-family: 'DM Sans', sans-serif;
  --h1-font-size: 62px;
  --h2-font-size: 48px;
  --h3-font-size: 36px;
  --h4-font-size: 32px;
  --h5-font-size: 24px;
  --h6-font-size: 22px;
  --p-font-size: 18px;

  /* Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Border Radius */
  --border-radius-large: 100px;   /* Pills */
  --border-radius-medium: 20px;   /* Cards */
  --border-radius-small: 10px;    /* Buttons */
}
```

### Missing Variables (Need to Add)

```css
:root {
  /* Neutral Palette */
  --gray-900: #222;
  --gray-700: #444;
  --gray-600: #555;
  --gray-500: #666;
  --gray-400: #777;
  --gray-300: #999;
  --gray-200: #ccc;
  --gray-100: #eaeaea;
  --gray-50: #fafafa;

  /* Spacing Scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  /* Simplified Radius */
  --radius-sm: 4px;
  --radius-md: 12px;
  --radius-lg: 24px;
  --radius-full: 9999px;
}
```

---

## Style Guidelines

### Button System (Target Implementation)

**Use BEM naming convention:**

```html
<!-- Primary button -->
<a class="btn btn--primary" href="#">Click Me</a>

<!-- Outline button -->
<a class="btn btn--outline" href="#">Learn More</a>

<!-- Light outline (on dark backgrounds) -->
<a class="btn btn--outline-light" href="#">Join Us</a>

<!-- Size modifiers -->
<a class="btn btn--primary btn--sm" href="#">Small</a>
<a class="btn btn--primary btn--lg" href="#">Large</a>

<!-- Full width -->
<a class="btn btn--primary btn--full" href="#">Full Width</a>
```

**CSS Implementation:**

```css
/* Base button */
.btn {
  display: inline-block;
  padding: var(--space-3) var(--space-5);
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: none;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Variants */
.btn--primary {
  background: var(--secondary-color);
  color: var(--white-color);
}

.btn--primary:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn--outline {
  background: transparent;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
}

.btn--outline:hover {
  background: var(--secondary-color);
  color: var(--white-color);
}
```

### Link Colors

**Standard link behavior:**
- Default: `var(--secondary-color)` (#2D6F72 teal)
- Hover: `var(--primary-color)` (#FC6C6D red)
- Underline on hover
- Footer links: Gray (#555) → Teal on hover
- Navigation: White on dark background

### Spacing

**Use spacing variables consistently:**
- Padding/margin: Always use `var(--space-*)` tokens
- Section padding: `var(--space-8)` or larger
- Component spacing: `var(--space-4)` to `var(--space-6)`
- Tight spacing: `var(--space-2)` to `var(--space-3)`

### Color Usage

**Never hard-code colors** - always use CSS variables:

```css
/* ❌ Bad */
background: #2D6F72;
color: #666;

/* ✅ Good */
background: var(--secondary-color);
color: var(--gray-500);
```

---

## Code Standards

### CSS Best Practices

**DO:**
- ✅ Use CSS custom properties for all colors, spacing, and typography
- ✅ Follow BEM naming convention for components
- ✅ Use semantic class names (`.btn--primary` not `.btn--blue`)
- ✅ Group related styles together
- ✅ Add comments for complex selectors
- ✅ Use relative units (rem, em) for typography
- ✅ Mobile-first media queries

**DON'T:**
- ❌ Use `!important` (fix specificity instead)
- ❌ Hard-code colors or spacing values
- ❌ Create duplicate selectors
- ❌ Use inline styles (except for dynamic JS)
- ❌ Use deep nesting (max 3 levels)
- ❌ Leave commented-out code (use git history)

### Specificity Guidelines

**Avoid specificity wars:**

```css
/* ❌ Bad - specificity war with !important */
.btn {
  background: blue !important;
}

.btn.btn-primary {
  background: red !important;
}

/* ✅ Good - proper specificity hierarchy */
.btn {
  background: var(--gray-500);
}

.btn--primary {
  background: var(--secondary-color);
}

.btn--primary.btn--disabled {
  background: var(--gray-300);
}
```

### HTML Best Practices

**DO:**
- ✅ Use semantic HTML5 elements (`<nav>`, `<main>`, `<article>`)
- ✅ Include ARIA labels for accessibility
- ✅ Use Jekyll includes for reusable components
- ✅ Add `alt` text to all images
- ✅ Use `loading="lazy"` for below-fold images
- ✅ Include `rel="noopener noreferrer"` on external links

**DON'T:**
- ❌ Use inline styles in HTML
- ❌ Duplicate footer/header (use `_includes/`)
- ❌ Hard-code data (use `_data/` YAML files)

---

## Performance Optimization Priority

### Immediate Actions (High Impact)

1. **Replace Font Awesome with SVG sprites**
   - Current: 320KB
   - Target: 5KB
   - Savings: 315KB (98%)

2. **Remove jQuery, use Vanilla JS**
   - Current: 85KB
   - Target: 0.5KB
   - Savings: 84.5KB (99%)

3. **PurgeCSS on Bootstrap**
   - Current: 155KB
   - Target: 35KB
   - Savings: 120KB (77%)

4. **Consolidate and minify CSS**
   - Current: 85KB (style.css)
   - Target: 35KB
   - Savings: 50KB (59%)

**Total Expected Savings: ~570KB (71% reduction)**

### Secondary Actions

5. Optimize images (resize, compress, WebP)
6. Remove Bootstrap JS (140KB)
7. Implement critical CSS properly
8. Remove inline styles from HTML

**Total Potential Savings: ~724KB (90.5% reduction)**

---

## Development Workflow

### Local Development

```bash
# Install dependencies
bundle install

# Run local server
bundle exec jekyll serve --livereload

# Build for production
JEKYLL_ENV=production bundle exec jekyll build

# Run smoke tests
bash scripts/smoke-tests.sh
```

### Git Workflow

**Branch Strategy:**
- `main` - Production branch
- `perf/perf-improvements` - Current performance optimization work
- Feature branches: `feature/name`
- Bug fixes: `fix/description`

**Commit Message Format:**
```
<type>: <description>

Examples:
feat: Add unified button system
fix: Remove duplicate footer implementation
perf: Replace Font Awesome with SVG sprites
style: Consolidate CSS duplicate selectors
docs: Update architecture documentation
```

### Testing Checklist

Before pushing:
- [ ] All pages render correctly
- [ ] Mobile responsive at all breakpoints (320px, 768px, 1024px, 1440px)
- [ ] No JavaScript console errors
- [ ] Links work and have correct colors
- [ ] Buttons have consistent styling
- [ ] Footer appears on all pages
- [ ] Run smoke tests: `bash scripts/smoke-tests.sh`

---

## Common Tasks

### Adding a New Button

```html
<!-- Use unified button system -->
<a class="btn btn--primary" href="#">Primary Action</a>
<a class="btn btn--outline" href="#">Secondary Action</a>
```

### Adding a New Page

1. Create `page-name.html` in root
2. Add YAML front matter:
```yaml
---
layout: null
permalink: /page-name/
---
```
3. Use includes:
```html
{% include header.html %}
<!-- Your content -->
{% include footer.html %}
```

### Updating Colors

1. Modify CSS variables in `css/style.css`:
```css
:root {
  --secondary-color: #2D6F72; /* Update here */
}
```
2. Never hard-code color values in CSS

### Adding a Project

1. Edit `_data/projects.yml`
2. Add entry:
```yaml
- name: "Project Name"
  url: "https://project-url.com"
  github: "https://github.com/org/repo"
  logo: "/images/projects/logo.png"
  year: 2025
```

### Adding a Partner/Sponsor

1. Edit `_data/partners.yml`
2. Add entry:
```yaml
- name: "Partner Name"
  logo: "/images/partners/logo.png"
  current: true  # false for previous partners
```

---

## Key Files Reference

### Primary HTML Files
- `index.html:287` - Includes header
- `index.html:686` - Includes footer
- `about.html` - Team and organization info
- `projects.html` - Project showcase

### Primary CSS Files
- `css/style.css` - Main stylesheet (2,252 lines - needs refactoring)
- `css/critical.css` - Critical CSS (251 lines - has duplicates)
- `css/bootstrap.css` - Bootstrap framework (candidate for replacement)

### JavaScript Files
- `js/custom.js:31` - Main site interactions
- `js/meeting.js` - Meetup API integration
- `js/add-view-all-card.js` - Project card functionality

### Data Files
- `_data/projects.yml` - Featured projects data
- `_data/partners.yml` - Sponsor logos and info
- `_data/navigation.yml` - Site navigation links

### Configuration
- `_config.yml` - Jekyll configuration
- `.gitignore` - Git ignore rules
- `Gemfile` - Ruby dependencies

---

## Known Dependencies

### Jekyll (Ruby)
- Jekyll 4.x
- Bundler for dependency management

### CSS Frameworks
- Bootstrap 4.1.3 (candidate for removal/reduction)
- Custom CSS (2,252 lines)

### JavaScript Libraries
- jQuery 3.x (candidate for removal)
- Bootstrap JS (candidate for removal)
- Magnific Popup (image lightbox)

### Fonts
- Google Fonts: DM Sans (400, 500, 700)
- Font Awesome 6.4.0 (candidate for replacement with SVG)

### External APIs
- Meetup.com API for event data
- CORS Anywhere proxy for API calls

---

## Optimization Agents Available

From `/tmp/claudepro-directory`:

1. **code-reviewer-agent** - For code quality reviews
   - Temperature: 0.4
   - Max tokens: 8000
   - Use for: Pre-commit reviews, architecture evaluation

2. **performance-optimizer-agent** - For performance tuning
   - Temperature: 0.3
   - Max tokens: 4000
   - Use for: Core Web Vitals, bundle optimization, memory profiling

3. **web-design-specialist** - For UI/UX improvements
   - Use for: Responsive layouts, visual design, CSS architecture

---

## Next Steps (Priority Order)

### Phase 1: Critical Fixes (Week 1)
1. ✅ **Code Review** - Identify all style inconsistencies (COMPLETED)
2. ✅ **Remove duplicate code** - Duplicate CSS, footer implementations (COMPLETED)
3. 🚧 **Consolidate 7 button systems into 1 unified system** (IN PROGRESS - see "Current Work in Progress" section)
   - ✅ Created `css/components/buttons.css` with BEM methodology
   - ⏳ Update HTML to use new button classes (29 instances across 6 files)
   - ⏳ Remove old button CSS from style.css (17+ definitions, ~150-200 lines)
   - ⏳ Test all pages
   - ⏳ Commit complete button system
4. Remove remaining `!important` declarations (~40-50 left after button cleanup)
5. Standardize link colors across site (4 different schemes)

### Phase 2: Performance (Week 2)
6. Replace Font Awesome with SVG sprites (-315KB)
7. Remove jQuery, convert to vanilla JS (-84.5KB)
8. Run PurgeCSS on Bootstrap (-120KB)
9. Optimize and compress images
10. Remove inline styles from index.html

### Phase 3: Code Quality (Week 3)
11. Split style.css into component files
12. Remove CSS duplication
13. Implement proper critical CSS
14. Add spacing and color variable systems
15. Document component usage

### Phase 4: Testing & Launch (Week 4)
16. Cross-browser testing
17. Mobile responsive testing
18. Lighthouse audit (target: 90+ all categories)
19. Memory profiling (target: <50MB Chrome)
20. Production deployment

---

## Resources

### Documentation
- Jekyll: https://jekyllrb.com/docs/
- Bootstrap 4: https://getbootstrap.com/docs/4.1/
- WCAG Accessibility: https://www.w3.org/WAI/WCAG21/quickref/
- Core Web Vitals: https://web.dev/vitals/

### Tools
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- Chrome DevTools Memory Profiler
- PurgeCSS: https://purgecss.com/
- Critical CSS: https://github.com/addyosmani/critical

### CivicTechWR Links
- Website: https://civictechwr.org
- Meetup: https://www.meetup.com/civictechwr/
- Slack: https://civictechwr.slack.com
- GitHub: https://github.com/CivicTechWR
- Blog: https://civictechwr.github.io/blog/

---

## Contact

**Organization:** CivicTech Waterloo Region
**Email:** civictechwr@gmail.com
**Maintainers:** See `about.html` for current organizers

---

## Quick Start Guide for New Session

When starting a new conversation to continue this work:

### Option 1: Complete Button System Migration (Recommended)

**Task:** "Complete the button system migration using the web-design-specialist agent"

**What will happen:**
1. Agent will update all 29 button instances across 6 HTML files to use new BEM classes
2. You'll need to manually test the pages (or ask for help testing)
3. Use code-reviewer agent to remove old button CSS from style.css
4. Commit the complete button system

**Estimated time:** 30-45 minutes

### Option 2: Continue with Next Priority Task

**Task:** "Remove remaining !important declarations from style.css using the code-reviewer agent"

**What will happen:**
1. Agent will identify all `!important` usage (should be ~40-50 instances after button cleanup)
2. Agent will propose specificity fixes for each instance
3. You'll apply the fixes and test

**Estimated time:** 1-2 hours

### Option 3: Run Full Site Audit

**Task:** "Run a comprehensive site audit using all available agents"

**What will happen:**
1. Performance audit with performance-optimizer-agent
2. Code quality review with code-reviewer-agent
3. Design consistency check with web-design-specialist
4. Consolidated report with prioritized action items

**Estimated time:** 45-60 minutes

---

**Last Updated:** October 15, 2025
**Next Review:** After button system completion
