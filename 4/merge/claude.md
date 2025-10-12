# CivicTech Waterloo Region - Claude Code Project Guide

**Project:** CivicTechWR Jekyll Website
**Branch:** perf/perf-improvements
**Last Updated:** October 12, 2025
**Tech Stack:** Jekyll, HTML, CSS, JavaScript, Bootstrap 4.1.3

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
1. ✅ **Code Review** - Identify all style inconsistencies
2. Remove 64 `!important` declarations
3. Consolidate 7 button systems into 1 unified system
4. Delete duplicate `footer.html` (keep `_includes/footer.html`)
5. Standardize link colors across site

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

**Last Updated:** October 12, 2025
**Next Review:** After Phase 1 completion (estimated 1 week)
