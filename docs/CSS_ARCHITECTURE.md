# CSS Architecture Guide - CivicTechWR

## 🎯 Overview

This document provides a comprehensive guide to the CSS architecture for the CivicTechWR website. The architecture follows modern best practices for maintainability, performance, and scalability.

## 📁 File Structure

```
css/
├── main.css                    # Master CSS loader
├── critical.css               # Critical above-fold styles
├── base/                       # Foundation layer
│   ├── variables.css          # Design tokens (127 properties)
│   ├── responsive.css         # Responsive utilities
│   └── typography.css         # Typography system
├── components/                 # Reusable UI components (15 files)
│   ├── buttons.css            # Button system (BEM methodology)
│   ├── navigation.css         # Header and navigation
│   ├── hero.css              # Main landing section
│   ├── services.css          # Services section
│   ├── footer.css            # Site footer
│   ├── avatar.css            # Profile images
│   ├── preloader.css         # Loading spinner
│   ├── icons.css             # SVG icon styling
│   ├── featured.css          # Featured numbers
│   ├── sponsors.css          # Partner logos
│   ├── projects.css          # Project cards
│   ├── forms.css             # Contact forms
│   ├── organizers.css        # Team section
│   ├── page-header.css       # Page titles
│   └── footer-utilities.css  # Footer utilities
├── pages/                      # Page-specific styles
│   ├── about.css             # About page
│   └── projects.css          # Projects page
├── bootstrap-custom.css        # Custom Bootstrap overrides
├── abstract-shapes.css         # Decorative shapes
├── fonts.css                  # Self-hosted fonts
├── style.css                  # Remaining styles
└── [build outputs]            # Purged, minified, optimized files
```

## 🏗️ Architecture Principles

### 1. Component-Based Design
- Each component is self-contained
- Clear separation of concerns
- Reusable across pages
- Consistent naming conventions

### 2. CSS Custom Properties
- 127 design tokens
- Single source of truth
- Easy theming and maintenance
- Consistent values across components

### 3. BEM Methodology
- Block__Element--Modifier pattern
- Predictable class naming
- No CSS specificity wars
- Zero `!important` declarations

### 4. Mobile-First Responsive
- Progressive enhancement
- Consistent breakpoints
- Touch-friendly interactions
- Performance optimized

## 🎨 Design System

### Color Palette

```css
:root {
  /* Brand Colors */
  --primary-color: #FC6C6D;      /* Red/coral - accent */
  --secondary-color: #2D6F72;     /* Teal - brand primary */
  --white-color: #fff;
  --dark-color: #000;
  --p-color: #717275;             /* Body text gray */
  
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
  
  /* Semantic Colors */
  --shadow-light: rgba(0, 0, 0, 0.1);
  --shadow-medium: rgba(0, 0, 0, 0.2);
  --shadow-heavy: rgba(0, 0, 0, 0.4);
  --overlay-light: rgba(255, 255, 255, 0.1);
  --overlay-medium: rgba(255, 255, 255, 0.2);
  --overlay-heavy: rgba(255, 255, 255, 0.7);
}
```

### Typography Scale

```css
:root {
  /* Font Sizes */
  --h1-font-size: 62px;
  --h2-font-size: 48px;
  --h3-font-size: 36px;
  --h4-font-size: 32px;
  --h5-font-size: 24px;
  --h6-font-size: 22px;
  --p-font-size: 18px;
  
  /* Responsive Font Sizes */
  --font-size-mobile-xs: 0.75rem;   /* 12px */
  --font-size-mobile-sm: 0.875rem;  /* 14px */
  --font-size-mobile-md: 1rem;      /* 16px */
  --font-size-mobile-lg: 1.125rem;  /* 18px */
  --font-size-mobile-xl: 1.25rem;   /* 20px */
  
  /* Additional Sizes */
  --font-size-2xl: 2rem;            /* 32px */
  --font-size-3xl: 2.5rem;          /* 40px */
  --font-size-4xl: 3.5rem;          /* 56px */
  --font-size-5xl: 4rem;            /* 64px */
  --font-size-6xl: 5rem;            /* 80px */
  --font-size-7xl: 6rem;            /* 96px */
}
```

### Spacing System

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-2-5: 10px;
  --space-3: 12px;
  --space-3-5: 14px;
  --space-4: 16px;
  --space-4-5: 18px;
  --space-5: 24px;
  --space-5-5: 28px;
  --space-6: 32px;
  --space-6-5: 36px;
  --space-7: 48px;
  --space-8: 64px;
  --space-10: 80px;
  --space-12: 96px;
  --space-15: 120px;
}
```

### Border Radius System

```css
:root {
  --radius-sm: 4px;
  --radius-md: 12px;
  --radius-card: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-2xl: 2rem;
  --radius-full: 9999px;
  
  /* Legacy support */
  --border-radius-small: 10px;
  --border-radius-medium: 20px;
  --border-radius-large: 100px;
}
```

## 🔧 Component Guidelines

### Button System

The button system uses BEM methodology with zero `!important` declarations:

```html
<!-- Primary button -->
<a class="btn btn--primary" href="#">Click Me</a>

<!-- Outline button -->
<a class="btn btn--outline" href="#">Learn More</a>

<!-- Size modifiers -->
<a class="btn btn--primary btn--sm" href="#">Small</a>
<a class="btn btn--primary btn--lg" href="#">Large</a>

<!-- State modifiers -->
<a class="btn btn--primary btn--disabled" href="#">Disabled</a>
```

### Navigation System

```html
<nav class="navbar">
  <div class="navbar-brand">CivicTechWR</div>
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" href="/">Home</a>
    </li>
  </ul>
</nav>
```

### Card Components

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
  </div>
  <div class="card-body">
    <p class="card-text">Card content</p>
  </div>
</div>
```

## 🚀 Performance Optimization

### Critical CSS Strategy

1. **Above-the-fold styles** are inlined in the HTML `<head>`
2. **Non-critical styles** are loaded asynchronously
3. **Component styles** are loaded on demand

### CSS Purging

- **PurgeCSS** removes unused CSS classes
- **Safelist** protects dynamic classes
- **Average reduction:** 25-30% file size

### Minification Pipeline

1. **PostCSS** - Combines duplicated selectors
2. **CleanCSS** - Minifies CSS files
3. **Analysis** - Generates performance metrics

### Build Process

```bash
# Complete CSS build
npm run build:css

# Individual steps
npm run purge:css    # Remove unused CSS
npm run minify:css   # Minify all files
npm run analyze:css  # Performance analysis
```

## 📱 Responsive Design

### Breakpoint System

```css
/* Mobile First Approach */
@media (min-width: 576px) { /* Small devices */ }
@media (min-width: 768px) { /* Medium devices */ }
@media (min-width: 992px) { /* Large devices */ }
@media (min-width: 1200px) { /* Extra large devices */ }
@media (min-width: 1440px) { /* Ultra wide devices */ }
```

### Responsive Utilities

```css
/* Display utilities */
.d-mobile-none { display: none; }
.d-tablet-block { display: block; }
.d-desktop-flex { display: flex; }

/* Spacing utilities */
.p-mobile-2 { padding: var(--space-2); }
.p-tablet-4 { padding: var(--space-4); }
.p-desktop-6 { padding: var(--space-6); }
```

## ♿ Accessibility

### WCAG 2.1 AA Compliance

- **Color contrast:** Minimum 4.5:1 ratio
- **Keyboard navigation:** Full support
- **Screen readers:** Semantic HTML
- **Focus management:** Visible focus indicators

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

## 🧪 Testing & Quality

### CSS Linting

```bash
# Lint all CSS files
npm run lint:css

# Fix auto-fixable issues
npm run lint:css -- --fix
```

### Performance Testing

```bash
# Run Lighthouse audit
npm run test:performance

# Analyze CSS complexity
npm run analyze:css
```

### Browser Testing

- **Chrome 90+**
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**
- **iOS Safari 14+**
- **Chrome Mobile 90+**

## 📚 Best Practices

### DO ✅

- Use CSS custom properties for all values
- Follow BEM naming convention
- Use semantic class names
- Group related styles together
- Use relative units (rem, em)
- Mobile-first responsive design
- Test across all breakpoints
- Document complex selectors

### DON'T ❌

- Use `!important` (fix specificity instead)
- Hard-code colors or spacing
- Create duplicate selectors
- Use inline styles (except dynamic JS)
- Use deep nesting (max 3 levels)
- Leave commented-out code
- Ignore accessibility requirements

## 🔄 Maintenance

### Adding New Components

1. Create component file in `css/components/`
2. Follow BEM naming convention
3. Use CSS custom properties
4. Add to `main.css` import list
5. Update documentation
6. Test across all breakpoints

### Modifying Existing Components

1. Maintain backward compatibility
2. Update all variants consistently
3. Test across all breakpoints
4. Update documentation
5. Run performance tests

### Performance Monitoring

- Run `npm run test:performance` regularly
- Monitor Core Web Vitals
- Check for unused CSS
- Validate with linters
- Test across browsers

## 📖 Resources

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [BEM Methodology](https://getbem.com/)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PurgeCSS Documentation](https://purgecss.com/)
- [Stylelint Rules](https://stylelint.io/user-guide/rules/)

---

**Last Updated:** October 17, 2025  
**Version:** 2.0.0  
**Performance Score:** 91/100 (Lighthouse)