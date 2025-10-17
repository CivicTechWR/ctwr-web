# CSS Architecture & Style Guide

## Overview

This CSS architecture follows modern best practices for maintainability, performance, and scalability. It's based on the principles found in [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) and implements DRY (Don't Repeat Yourself) and SOLID principles.

## Architecture

### File Structure

```
css/
├── main.css                    # Master loader (2.6 KB)
├── critical.css               # Critical above-fold CSS (2.1 KB)
├── base/                       # Foundation layer
│   ├── variables.css          # CSS custom properties (3.6 KB)
│   ├── responsive.css         # Responsive utilities (11.9 KB)
│   └── typography.css         # Typography system (2.7 KB)
├── components/                 # Reusable UI components
│   ├── buttons.css            # Button system (7.1 KB)
│   ├── navigation.css         # Navigation system (6.4 KB)
│   ├── hero.css              # Hero section (3.8 KB)
│   ├── services.css          # Services section (5.6 KB)
│   ├── footer.css            # Footer component (3.8 KB)
│   ├── avatar.css            # Profile images (1.2 KB)
│   ├── preloader.css         # Loading spinner (0.8 KB)
│   ├── icons.css             # SVG icon styling (0.3 KB)
│   ├── featured.css          # Featured numbers (0.4 KB)
│   ├── sponsors.css          # Partner logos (1.1 KB)
│   ├── projects.css          # Project cards (1.8 KB)
│   ├── forms.css             # Contact forms (1.5 KB)
│   ├── organizers.css        # Team section (2.1 KB)
│   ├── page-header.css       # Page titles (0.6 KB)
│   └── footer-utilities.css  # Footer utilities (0.2 KB)
├── pages/                      # Page-specific styles
│   ├── about.css             # About page (2.0 KB)
│   └── projects.css          # Projects page (1.3 KB)
├── bootstrap-custom.css        # Custom Bootstrap (2.1 KB)
├── abstract-shapes.css         # Decorative shapes (6.6 KB)
├── fonts.css                  # Self-hosted fonts (568 B)
├── style.css                  # Remaining styles (14.3 KB)
├── purged/                    # Purged CSS files (optimized)
├── minified/                  # Minified CSS files
└── *.min.css                 # Individual minified files
```

### Load Order

1. **Critical CSS** - Above-the-fold styles (inline)
2. **Base Layer** - Variables, responsive utilities, typography
3. **Layout Layer** - Grid system, utilities
4. **Component Layer** - Reusable UI components (15 components)
5. **Page Layer** - Page-specific styles
6. **Utility Layer** - Abstract shapes, helpers

## Performance Metrics

### Current State (Post-Optimization)
- **Original CSS:** 74,282 bytes (72.5 KB)
- **Purged CSS:** ~55,000 bytes (~53.7 KB)
- **Minified CSS:** ~47,000 bytes (~45.9 KB)
- **Critical CSS:** 2,100 bytes (2.1 KB)
- **Total Savings:** ~27,000 bytes (36.4% reduction)

### Component Architecture Benefits
- **Modular Design:** 15 focused component files
- **Zero !important:** Clean specificity hierarchy
- **Consistent Variables:** 127 CSS custom properties
- **BEM Methodology:** Predictable class naming
- **Mobile-First:** Responsive design system
- **Performance Optimized:** Critical CSS + purging + minification

## CSS Standards

### Naming Conventions

#### BEM Methodology
```css
/* Block */
.btn { }

/* Element */
.btn__icon { }

/* Modifier */
.btn--primary { }
.btn--primary.btn--large { }
```

#### CSS Custom Properties
```css
/* Use semantic naming */
--primary-color: #FC6C6D;
--secondary-color: #2D6F72;
--space-4: 16px;
--radius-sm: 4px;
```

### Code Quality Rules

#### ✅ DO
- Use CSS custom properties for all colors, spacing, and typography
- Follow BEM naming convention for components
- Use semantic class names (`.btn--primary` not `.btn--blue`)
- Group related styles together
- Use relative units (rem, em) for typography
- Mobile-first responsive design
- Use logical properties where possible

#### ❌ DON'T
- Use `!important` (fix specificity instead)
- Hard-code colors or spacing values
- Create duplicate selectors
- Use inline styles (except for dynamic JS)
- Use deep nesting (max 3 levels)
- Leave commented-out code

### Specificity Guidelines

```css
/* ❌ Bad - specificity war */
.btn { background: blue !important; }
.btn.btn-primary { background: red !important; }

/* ✅ Good - proper hierarchy */
.btn { background: var(--gray-500); }
.btn--primary { background: var(--secondary-color); }
.btn--primary.btn--disabled { background: var(--gray-300); }
```

## Build Process

### Development
```bash
# Install dependencies
npm install

# Run development server
bundle exec jekyll serve --livereload

# Lint CSS
npm run lint:css

# Analyze CSS complexity
npm run analyze:css
```

### Production
```bash
# Complete CSS build pipeline
npm run build:css

# Optimize all assets
npm run optimize:all

# Build for production
npm run build:prod

# Test performance
npm run test:performance
```

### Build Pipeline

The CSS build process includes:

1. **PurgeCSS** - Removes unused CSS classes
2. **PostCSS** - Combines duplicated selectors, optimizes media queries
3. **Minification** - Compresses CSS files
4. **Analysis** - Generates performance metrics
5. **Critical CSS** - Extracts above-the-fold styles

### Available Scripts

- `npm run build:css` - Complete CSS build pipeline
- `npm run minify:css` - Minify all CSS files
- `npm run purge:css` - Remove unused CSS
- `npm run optimize:all` - Full optimization pipeline
- `npm run lint:css` - Lint CSS files
- `npm run analyze:css` - Analyze CSS complexity
- `npm run test:performance` - Run Lighthouse audit

## Component System

### Architecture Overview

The CSS is organized into 15 focused component files, each handling a specific UI concern:

#### Core Components
- **buttons.css** - Unified button system with BEM methodology
- **navigation.css** - Header and navigation system
- **hero.css** - Main landing section
- **services.css** - What we do section
- **footer.css** - Site footer

#### Supporting Components
- **avatar.css** - Profile images and user avatars
- **preloader.css** - Loading spinner and animations
- **icons.css** - SVG icon styling
- **featured.css** - Featured numbers and statistics
- **sponsors.css** - Partner and sponsor logos
- **projects.css** - Project showcase cards
- **forms.css** - Contact forms and inputs
- **organizers.css** - Team and organizers section
- **page-header.css** - Page titles and headers
- **footer-utilities.css** - Footer-specific utilities

### Component Guidelines

#### Button System

The button system uses BEM methodology with zero `!important` declarations:

```html
<!-- Primary button -->
<a class="btn btn--primary" href="#">Click Me</a>

<!-- Outline button -->
<a class="btn btn--outline" href="#">Learn More</a>

<!-- Size modifiers -->
<a class="btn btn--primary btn--sm" href="#">Small</a>
<a class="btn btn--primary btn--lg" href="#">Large</a>
```

### Color System

All colors use CSS custom properties:

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
}
```

### Spacing System

Consistent spacing using CSS custom properties:

```css
:root {
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
}
```

## Performance Optimization

### Critical CSS

Critical CSS is extracted for above-the-fold content to improve First Contentful Paint (FCP).

### CSS Purging

Unused CSS is automatically removed using PurgeCSS, reducing file sizes by 23% on average.

### Minification

All CSS files are minified for production, achieving 34.3% total size reduction.

### Web Vitals Optimization

- **LCP (Largest Contentful Paint):** 2.9s
- **FCP (First Contentful Paint):** 2.0s
- **CLS (Cumulative Layout Shift):** 0
- **FID (First Input Delay):** 60ms

## Accessibility

### WCAG 2.1 AA Compliance

- Color contrast ratio minimum 4.5:1
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Proper heading structure

### Focus Management

```css
.btn:focus {
  outline: 2px solid var(--secondary-color);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(45, 111, 114, 0.2);
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Maintenance

### Adding New Components

1. Create component file in appropriate directory
2. Follow BEM naming convention
3. Use CSS custom properties
4. Add to `main.css` import list
5. Update documentation

### Modifying Existing Components

1. Maintain backward compatibility
2. Update all variants consistently
3. Test across all breakpoints
4. Update documentation

### Performance Monitoring

- Run `npm run test:performance` regularly
- Monitor Core Web Vitals
- Check for unused CSS with `npm run analyze:css`
- Validate with `npm run lint:css`

## Resources

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [BEM Methodology](https://getbem.com/)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PurgeCSS Documentation](https://purgecss.com/)
- [Stylelint Rules](https://stylelint.io/user-guide/rules/)

## Contributing

When contributing to CSS:

1. Follow the established architecture
2. Use the provided build tools
3. Maintain performance standards
4. Test across all supported browsers
5. Update documentation as needed

---

**Last Updated:** October 17, 2025  
**Version:** 2.0.0  
**Performance Score:** 91/100 (Lighthouse)