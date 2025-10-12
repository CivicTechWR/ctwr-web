# CivicTech Waterloo Region Website - Developer Guide

## Overview

This is the official website for CivicTech Waterloo Region, built with Jekyll and optimized for performance, accessibility, and maintainability.

## Tech Stack

- **Static Site Generator**: Jekyll 4.x
- **CSS Framework**: Bootstrap 5.3.3
- **JavaScript**: jQuery 3.7.1, Vanilla JS
- **Build Tools**: npm, clean-css-cli, terser
- **Linting**: ESLint, Stylelint, HTMLHint
- **Accessibility**: Pa11y CI
- **Security**: Bundler Audit, npm audit

## Project Structure

```
ctwr-web/
├── _config.yaml          # Jekyll configuration
├── _data/                # Jekyll data files
├── _includes/            # Jekyll includes (header, footer)
├── _site/                # Generated site (gitignored)
├── css/                  # Stylesheets
│   ├── style.css         # Main stylesheet
│   ├── style.min.css     # Minified version
│   └── critical.css      # Critical CSS for above-the-fold
├── js/                   # JavaScript files
│   ├── custom.js         # Custom functionality
│   ├── meeting.js        # Event management
│   └── bundle.min.js     # Minified bundle
├── images/               # Image assets
├── scripts/              # Build and deployment scripts
├── .github/workflows/    # GitHub Actions CI/CD
└── docs/                 # Documentation
```

## Development Setup

### Prerequisites

- Ruby 3.1+ (for Jekyll)
- Node.js 20+ (for build tools)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CTWR-Org/ctwr-web.git
   cd ctwr-web
   ```

2. Install Ruby dependencies:
   ```bash
   bundle install
   ```

3. Install Node.js dependencies:
   ```bash
   npm install
   ```

### Development Commands

```bash
# Start development server
bundle exec jekyll serve --livereload

# Build for production
npm run build:prod

# Run linting
npm run lint

# Run accessibility tests
npx pa11y-ci

# Run security audit
bundle exec bundler-audit check --update
npm audit
```

## Build Process

The build process includes:

1. **CSS Minification**: Uses clean-css-cli to minify stylesheets
2. **JavaScript Minification**: Uses terser to minify and bundle JS files
3. **Jekyll Build**: Generates static site with SEO optimization
4. **Asset Optimization**: Images are optimized for web delivery

### Production Build

```bash
npm run build:prod
```

This command:
- Minifies CSS and JavaScript
- Builds the Jekyll site
- Generates sitemap and RSS feed
- Optimizes assets

## Code Quality

### Linting

- **HTML**: HTMLHint for markup validation
- **CSS**: Stylelint for stylesheet linting
- **JavaScript**: ESLint for code quality

### Accessibility

- **WCAG 2.1 AA** compliance
- **Pa11y CI** for automated testing
- **Keyboard navigation** support
- **Screen reader** compatibility

### Security

- **Bundler Audit** for Ruby gem vulnerabilities
- **npm audit** for JavaScript package vulnerabilities
- **Security headers** via .htaccess
- **Content Security Policy** implementation

## Performance Optimizations

### Critical CSS

Critical above-the-fold CSS is inlined in HTML files for faster initial render.

### Resource Hints

- `preload` for critical resources
- `preconnect` for external domains
- `dns-prefetch` for third-party resources

### Image Optimization

- WebP format for modern browsers
- Lazy loading for below-the-fold images
- Responsive images with `<picture>` elements

## Deployment

### GitHub Pages

The site is automatically deployed to GitHub Pages on push to `main` branch.

### Branch Previews

Feature branches are deployed to preview URLs:
- Branch: `feature/example` → `https://username.github.io/repo/feature/example/`

### Manual Deployment

```bash
# Build and deploy to preview branch
./scripts/setup-preview.sh
```

## Contributing

### Code Style

- Follow existing code patterns
- Use semantic HTML5 elements
- Maintain accessibility standards
- Write descriptive commit messages

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with appropriate tests
3. Run linting and accessibility checks
4. Submit pull request with description
5. Address review feedback

### Commit Convention

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting changes
- `refactor:` for code refactoring
- `perf:` for performance improvements

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Targets

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Accessibility Standards

- **WCAG 2.1 AA** compliance
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** ratio 4.5:1 minimum

## Security Considerations

- **HTTPS** enforcement
- **Security headers** implementation
- **Content Security Policy** (CSP)
- **Dependency vulnerability** scanning

## Troubleshooting

### Common Issues

1. **Jekyll build fails**: Check Ruby version and gem dependencies
2. **CSS minification errors**: Verify CSS syntax and remove comments
3. **JavaScript errors**: Check ESLint configuration and fix syntax issues
4. **Accessibility failures**: Review ARIA labels and keyboard navigation

### Getting Help

- Check existing issues on GitHub
- Review documentation in `/docs` folder
- Contact maintainers via GitHub discussions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TemplateMo for the base template
- Bootstrap team for the CSS framework
- Jekyll team for the static site generator
- CivicTechWR community for feedback and contributions
