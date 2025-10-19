# Critical CSS Implementation

## Overview

Critical CSS is a performance optimization technique that inlines minimal CSS in the HTML `<head>` to render above-the-fold content instantly, while loading the full stylesheet asynchronously.

## Files

- `css/critical.css` - Source critical CSS (3.4KB) with above-the-fold styles
- `css/critical.min.css` - Minified version (2.4KB)
- `_includes/critical-css.html` - Jekyll include with inlined critical CSS

## What's Included

The critical CSS contains only the essentials for instant above-the-fold rendering:

1. **Essential CSS Variables** - Colors, spacing, fonts
2. **Font Loading** - DM Sans font-face declaration
3. **Base Reset** - Minimal reset styles
4. **Header/Navigation** - Fixed header and navbar
5. **Hero Section** - Hero title and background gradient
6. **Basic Buttons** - Primary and light button variants
7. **Container** - Responsive container layout

## Usage (Optional)

To enable critical CSS for improved First Contentful Paint (FCP):

### Option 1: Include in Jekyll Templates (Recommended)

Add to the `<head>` section of your HTML files BEFORE loading main.css:

```html
<head>
  <!-- ... other head content ... -->

  <!-- Critical CSS for instant above-fold rendering -->
  {% include critical-css.html %}

  <!-- Main CSS loaded asynchronously or after critical CSS -->
  <link href="css/main.css" rel="stylesheet" />
</head>
```

### Option 2: Async CSS Loading (Advanced)

For maximum performance, load main.css asynchronously:

```html
<head>
  <!-- Critical CSS inline -->
  {% include critical-css.html %}

  <!-- Async CSS loading with JavaScript fallback -->
  <link rel="preload" href="css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="css/main.css"></noscript>
</head>
```

## Performance Impact

**Expected Improvements:**
- **First Contentful Paint (FCP)**: -200ms to -500ms
- **Largest Contentful Paint (LCP)**: -100ms to -300ms
- **Cumulative Layout Shift (CLS)**: Reduced FOUC (Flash of Unstyled Content)
- **Lighthouse Performance Score**: +5 to +15 points

## Maintenance

When updating above-the-fold styles, remember to update critical CSS:

1. Edit `css/critical.css` with necessary changes
2. Minify: `npm run minify:critical` (or manually with cleancss)
3. Update `_includes/critical-css.html` with new minified content

## Current Status

**Status**: ✅ Created, ready to enable
**Size**: 2.4KB minified
**Coverage**: Header, navigation, hero, basic buttons, container
**Production Ready**: Yes

## Notes

- Keep critical CSS under 10KB for optimal performance
- Only include styles needed for above-the-fold content
- Full main.css (132KB) still provides complete styling
- Critical CSS is optional - site works fine without it
