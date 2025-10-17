# CSS Quick Reference - CivicTechWR

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server
bundle exec jekyll serve --livereload

# Build CSS
npm run build:css

# Lint CSS
npm run lint:css
```

## 🎨 Common Patterns

### Button Usage

```html
<!-- Primary button -->
<a class="btn btn--primary" href="#">Primary</a>

<!-- Outline button -->
<a class="btn btn--outline" href="#">Outline</a>

<!-- Size variants -->
<a class="btn btn--primary btn--sm" href="#">Small</a>
<a class="btn btn--primary btn--lg" href="#">Large</a>

<!-- State variants -->
<a class="btn btn--primary btn--disabled" href="#">Disabled</a>
```

### Card Components

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
  </div>
  <div class="card-body">
    <p class="card-text">Content</p>
  </div>
</div>
```

### Navigation

```html
<nav class="navbar">
  <div class="navbar-brand">Brand</div>
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" href="/">Home</a>
    </li>
  </ul>
</nav>
```

## 🎯 CSS Custom Properties

### Colors

```css
/* Brand Colors */
--primary-color: #FC6C6D;      /* Red/coral */
--secondary-color: #2D6F72;     /* Teal */
--white-color: #fff;
--dark-color: #000;
--p-color: #717275;             /* Body text */

/* Grays */
--gray-900: #222;
--gray-700: #444;
--gray-600: #555;
--gray-500: #666;
--gray-400: #777;
--gray-300: #999;
--gray-200: #ccc;
--gray-100: #eaeaea;
--gray-50: #fafafa;

/* Semantic Colors */
--shadow-light: rgba(0, 0, 0, 0.1);
--shadow-medium: rgba(0, 0, 0, 0.2);
--overlay-light: rgba(255, 255, 255, 0.1);
```

### Spacing

```css
/* Spacing Scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-10: 80px;
--space-12: 96px;
--space-15: 120px;
```

### Typography

```css
/* Font Sizes */
--h1-font-size: 62px;
--h2-font-size: 48px;
--h3-font-size: 36px;
--h4-font-size: 32px;
--h5-font-size: 24px;
--h6-font-size: 22px;
--p-font-size: 18px;

/* Responsive Font Sizes */
--font-size-mobile-md: 1rem;      /* 16px */
--font-size-mobile-lg: 1.125rem;  /* 18px */
--font-size-mobile-xl: 1.25rem;   /* 20px */
--font-size-2xl: 2rem;            /* 32px */
--font-size-3xl: 2.5rem;          /* 40px */
--font-size-4xl: 3.5rem;          /* 56px */
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 12px;
--radius-card: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-2xl: 2rem;
--radius-full: 9999px;
```

## 📱 Responsive Utilities

### Display

```css
.d-mobile-none { display: none; }
.d-tablet-block { display: block; }
.d-desktop-flex { display: flex; }
```

### Spacing

```css
.p-mobile-2 { padding: var(--space-2); }
.p-tablet-4 { padding: var(--space-4); }
.p-desktop-6 { padding: var(--space-6); }
```

### Text

```css
.text-mobile-sm { font-size: var(--font-size-mobile-sm); }
.text-tablet-md { font-size: var(--font-size-tablet-md); }
.text-desktop-lg { font-size: var(--font-size-desktop-lg); }
```

## 🏗️ Component Structure

### File Organization

```
css/
├── main.css                    # Master loader
├── critical.css               # Critical CSS
├── base/                       # Foundation
│   ├── variables.css          # Design tokens
│   ├── responsive.css         # Responsive utilities
│   └── typography.css         # Typography
├── components/                 # UI components
│   ├── buttons.css            # Button system
│   ├── navigation.css         # Navigation
│   ├── hero.css              # Hero section
│   ├── services.css          # Services
│   ├── footer.css            # Footer
│   ├── avatar.css            # Profile images
│   ├── preloader.css         # Loading spinner
│   ├── icons.css             # SVG icons
│   ├── featured.css          # Featured numbers
│   ├── sponsors.css          # Partner logos
│   ├── projects.css          # Project cards
│   ├── forms.css             # Contact forms
│   ├── organizers.css        # Team section
│   ├── page-header.css       # Page titles
│   └── footer-utilities.css  # Footer utilities
├── pages/                      # Page-specific
│   ├── about.css             # About page
│   └── projects.css          # Projects page
└── [build outputs]            # Optimized files
```

## 🔧 Build Commands

```bash
# Complete CSS build
npm run build:css

# Individual steps
npm run purge:css    # Remove unused CSS
npm run minify:css   # Minify all files
npm run lint:css     # Lint CSS
npm run analyze:css  # Performance analysis

# Full optimization
npm run optimize:all

# Performance testing
npm run test:performance
```

## 🎯 BEM Naming Convention

### Block

```css
.btn { }           /* Button component */
.card { }          /* Card component */
.navbar { }        /* Navigation component */
```

### Element

```css
.btn__icon { }     /* Button icon */
.card__header { }  /* Card header */
.navbar__brand { } /* Navigation brand */
```

### Modifier

```css
.btn--primary { }      /* Primary button */
.btn--large { }        /* Large button */
.btn--primary.btn--large { } /* Primary large button */
```

## ♿ Accessibility

### Focus Styles

```css
*:focus {
  outline: 2px solid var(--secondary-color);
  outline-offset: 2px;
}

.btn:focus {
  box-shadow: 0 0 0 4px var(--secondary-alpha-2);
}
```

### Screen Reader

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 🚨 Common Mistakes

### ❌ Don't Do

```css
/* Hard-coded values */
.btn { color: #FC6C6D; }

/* Specificity wars */
.btn { color: blue !important; }

/* Deep nesting */
.navbar .nav .nav-item .nav-link { }

/* Inline styles */
<div style="color: red;">Text</div>
```

### ✅ Do Instead

```css
/* Use variables */
.btn { color: var(--primary-color); }

/* Fix specificity */
.btn--primary { color: var(--primary-color); }

/* Flat structure */
.nav-link { }

/* CSS classes */
<div class="text-primary">Text</div>
```

## 📊 Performance Tips

1. **Use CSS custom properties** for consistent values
2. **Follow BEM methodology** for predictable selectors
3. **Minimize specificity** to avoid conflicts
4. **Use mobile-first** responsive design
5. **Test across breakpoints** for consistency
6. **Run performance audits** regularly
7. **Purge unused CSS** in production
8. **Minify CSS files** for smaller bundles

## 🔍 Debugging

### CSS Issues

```bash
# Lint CSS
npm run lint:css

# Check for unused CSS
npm run analyze:css

# Performance audit
npm run test:performance
```

### Browser DevTools

1. **Elements panel** - Inspect computed styles
2. **Sources panel** - Debug CSS files
3. **Performance panel** - Analyze rendering
4. **Lighthouse** - Audit performance

---

**Need Help?** Check the full [CSS Architecture Guide](./CSS_ARCHITECTURE.md) or [CSS README](../css/README.md)