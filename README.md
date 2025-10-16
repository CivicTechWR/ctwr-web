# CivicTech Waterloo Region Website

[![Build Status](https://github.com/CTWR-Org/ctwr-web/workflows/CI/badge.svg)](https://github.com/CTWR-Org/ctwr-web/actions)
[![Accessibility](https://github.com/CTWR-Org/ctwr-web/workflows/Accessibility/badge.svg)](https://github.com/CTWR-Org/ctwr-web/actions)
[![Security](https://github.com/CTWR-Org/ctwr-web/workflows/Security/badge.svg)](https://github.com/CTWR-Org/ctwr-web/actions)

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

   # Quick setup (checks Ruby, installs Bundler & gems)
   ./scripts/setup-ruby.sh

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
├── _includes/            # Reusable components (header, footer)
├── css/                  # Stylesheets
│   ├── style.css         # Main stylesheet
│   └── critical.css      # Critical CSS for above-the-fold
├── js/                   # JavaScript files
│   ├── custom.js         # Custom functionality
│   └── meeting.js        # Event management
├── images/               # Image assets (optimized for web)
├── scripts/              # Build and deployment scripts
├── .github/workflows/    # GitHub Actions CI/CD
└── docs/                 # Documentation
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run serve              # Start Jekyll server with live reload
npm run build:dev          # Build for development
npm run build:prod         # Build for production (with minification)

# Code Quality
npm run lint               # Run all linters (HTML, CSS, JS)
npm run format             # Format code with Prettier

# Testing
npm run test:accessibility # Run accessibility tests
npm run test:security      # Run security audits
npm run test               # Run all tests

# Deployment
npm run preview            # Deploy preview branch
```

### Code Quality

This project maintains high code quality standards:

- **HTML**: Validated with HTMLHint
- **CSS**: Linted with Stylelint
- **JavaScript**: Linted with ESLint
- **Accessibility**: Tested with Pa11y CI
- **Security**: Audited with Bundler Audit and npm audit

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
- **Twitter**: [@civictechwr](https://twitter.com/civictechwr)

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/CTWR-Org/ctwr-web)
![GitHub issues](https://img.shields.io/github/issues/CTWR-Org/ctwr-web)
![GitHub pull requests](https://img.shields.io/github/issues-pr/CTWR-Org/ctwr-web)
![GitHub stars](https://img.shields.io/github/stars/CTWR-Org/ctwr-web)

---

**Made with ❤️ by the CivicTech Waterloo Region community**
