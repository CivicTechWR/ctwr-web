# CivicTech Waterloo Region Website

[![Build Status](https://github.com/CivicTechWR/ctwr-web/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/CivicTechWR/ctwr-web/actions/workflows/deploy.yml)
[![Accessibility](https://github.com/CivicTechWR/ctwr-web/actions/workflows/accessibility.yml/badge.svg?branch=main)](https://github.com/CivicTechWR/ctwr-web/actions/workflows/accessibility.yml)
[![Security](https://github.com/CivicTechWR/ctwr-web/actions/workflows/security.yml/badge.svg?branch=main)](https://github.com/CivicTechWR/ctwr-web/actions/workflows/security.yml)

The official website for [CivicTech Waterloo Region](https://civictechwr.org), a community group that brings together people from different sectors and industries to actively solve issues facing our local community using technology-based solutions.

## 🌟 Features

- **Modern & Responsive**: Built with Jekyll and Bootstrap 5.3.3
- **Accessible**: WCAG 2.1 AA compliant with comprehensive keyboard navigation
- **Performant**: Optimized for Core Web Vitals with critical CSS and lazy loading
- **Secure**: Regular security audits and updated dependencies
- **SEO Optimized**: Built-in sitemap, RSS feed, and meta tags
- **Developer Friendly**: Comprehensive documentation and automated workflows

## 🚀 Quick Start

### Prerequisites

- Ruby 3.1+ (3.4.5 recommended; see `.ruby-version`)
- Node.js 22+ (for build tools; see `.nvmrc`)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CTWR-Org/ctwr-web.git
   cd ctwr-web
   ```

2. **Install dependencies**

   ```bash
   # Ensure you are on Ruby 3.1+ (3.4.5 recommended)
   # with rbenv (example):
   #   rbenv install 3.4.5 && rbenv local 3.4.5
   # or asdf: asdf install ruby 3.4.5 && asdf local ruby 3.4.5

   # Install Ruby gems
   bundle install

   # Install Node.js dependencies
   npm install
   ```

3. **Start development server**

   ```bash
   npm run serve
   ```

   The site will be available at `http://localhost:4000`

### Troubleshooting Ruby

- If `bundle exec jekyll build` fails with missing gems like `sass-embedded` or
  `google-protobuf`, verify your Ruby matches `.ruby-version` (3.4.5). Older
  Rubies (e.g., 2.6) are not supported. After switching Ruby, run:
  ```bash
  rm -rf vendor/bundle
  gem install bundler
  bundle install
  ```

## 📁 Project Structure

```
ctwr-web/
├── _config.yaml          # Jekyll configuration
├── _data/                # Jekyll data files (navigation, partners, projects)
├── _includes/            # Reusable components (header, footer, meeting section)
├── _site/                # Build output (ignored)
├── css/                  # Stylesheets
│   ├── main.css          # Primary stylesheet
│   ├── minified/         # Minified output (generated)
│   └── purged/           # Purged output (generated)
├── js/                   # JavaScript bundles + data
├── images/               # Image assets (optimized for web)
├── scripts/              # Build and lint scripts
├── tests/                # CSS sanity checks + plugin regression tests
└── .github/workflows/    # GitHub Actions CI/CD
```

## 📅 Luma Event Sync

The meeting section on the homepage shows live event data fetched from Luma at build time.

**How it works:**

`_plugins/fetch_luma_event.rb` is a Jekyll generator that runs during every build. It fetches the
Luma iCal feed, finds the next upcoming event, and stores it in `site.data['next_meeting']`.
`_includes/meeting-section.html` renders this data into the static HTML.

- **iCal feed**: `https://api2.luma.com/ics/get?entity=calendar&id=cal-BVpgpDCgYaCqcPx`
- **Fallback**: if the fetch fails or no future events exist, a generic "Wednesdays at 5:30 PM,
  Downtown Kitchener" message is shown with a link to the Luma calendar.

**Why it must deploy via GitHub Actions (not legacy GitHub Pages):**

GitHub Pages' legacy build mode runs Jekyll with `--safe`, which disables all custom plugins.
The site **must** be deployed by pushing to the `gh-pages` branch (done automatically by
`.github/workflows/deploy.yml` using `peaceiris/actions-gh-pages`), and GitHub Pages must be
configured to serve from the `gh-pages` branch — **not** the `main` branch.

> If you ever see "Wednesdays at 6:00 PM" (the Liquid template default) on the live site, the
> Pages source is misconfigured. Go to **Settings → Pages** and set the source to
> **Deploy from a branch → gh-pages → / (root)**.

**Rebuild schedule:**

The site rebuilds automatically on two schedules so event data stays current:
- **Monday 3 PM UTC** — refresh before the Wednesday hacknight
- **Thursday 2 AM UTC** — refresh after Wednesday hacknight ends (so the next event shows)

Run the plugin regression tests with:
```bash
npm run test:luma
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run serve              # Start Jekyll server with live reload
npm run build:dev          # Build for development
npm run build:prod         # Build for production (includes minify)

# Assets
npm run minify             # Generate minified CSS/JS

# Code Quality
npm run lint               # Run all linters
npm run lint:css           # CSS linting
npm run lint:md            # Markdown linting
npm run lint:yaml          # YAML linting
npm run lint:json          # JSON linting
npm run lint:shell         # Shell linting

# Testing
npm run test               # Run the full automated test suite
npm run test:css           # CSS component tests
npm run test:css:visual    # Asset smoke tests
npm run test:css:all       # Full CSS test suite
npm run test:luma          # Luma event sync regression tests
```

### Code Quality

This project maintains code quality standards:

- **HTML**: Validated with HTMLHint (CI)

## 🚀 Deployments

See `docs/deployments.md` for production and preview deploy details, including
the preview URL format and troubleshooting tips.

- **CSS**: Linted with Stylelint
- **Markdown/YAML/JSON**: Linted via npm scripts
- **Accessibility**: Tested with Pa11y CI
- **Security**: Audited with Bundler Audit

## 🎨 Design System

### Colors

- **Primary**: #FC6C6D (Coral)
- **Secondary**: #2D6F72 (Teal)
- **Background**: #FFFFFF (White)
- **Text**: #000000 (Black)
- **Muted**: #717275 (Gray)

### Typography

- **Font Family**: DM Sans
- **Headings**: 700 weight
- **Body**: 400 weight
- **UI Elements**: 500 weight

## ♿ Accessibility

This website is built with accessibility in mind:

- **WCAG 2.1 AA** compliant
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** ratios (4.5:1 minimum)
- **Semantic HTML** structure
- **ARIA labels** for interactive elements

## 🚀 Performance

Optimized for speed and user experience:

- **Critical CSS** inlined for faster initial render
- **Resource hints** (preload, preconnect, dns-prefetch)
- **Lazy loading** for images below the fold
- **WebP images** for modern browsers
- **Minified assets** for production

## 🔒 Security

Security is a top priority:

- **HTTPS** enforcement
- **Security headers** (CSP, HSTS, etc.)
- **Dependency vulnerability** scanning
- **Regular security** audits
- **No hardcoded secrets**

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📚 Documentation

- This README is the primary developer reference for setup and scripts.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TemplateMo](https://templatemo.com) for the base template
- [Bootstrap](https://getbootstrap.com) for the CSS framework
- [Jekyll](https://jekyllrb.com) for the static site generator
- [CivicTechWR](https://civictechwr.org) community for feedback and contributions

## 📞 Contact

- **Website**: [civictechwr.org](https://civictechwr.org)
- **Email**: civictechwr@gmail.com
- **GitHub**: [@CTWR-Org](https://github.com/CTWR-Org)
- **Threads**: [@civictechwr](https://www.threads.com/@civictechwr)
- **Bluesky**: [@civictechwr.bsky.social](https://bsky.app/profile/civictechwr.bsky.social)

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/CivicTechWR/ctwr-web)
![GitHub issues](https://img.shields.io/github/issues/CivicTechWR/ctwr-web)
![GitHub pull requests](https://img.shields.io/github/issues-pr/CivicTechWR/ctwr-web)
![GitHub stars](https://img.shields.io/github/stars/CivicTechWR/ctwr-web)

---

**Made with ❤️ by the CivicTech Waterloo Region community**
