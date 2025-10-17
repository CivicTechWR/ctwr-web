# Repository Cleanup Guide

## Overview

This document outlines the repository cleanup process and guidelines to maintain a clean, well-defined development environment for the CivicTech Waterloo Region website.

## Cleanup Philosophy

- **Keep only essential files** in the repository
- **Exclude build artifacts** and generated files
- **Maintain clear separation** between source and output
- **Document all cleanup decisions** for team consistency

## Files and Directories Removed

### Build Artifacts
- `_site/` - Jekyll build output (regenerated on build)
- `.jekyll-cache/` - Jekyll cache directory (regenerated on build)
- `css/purged/` - Purged CSS files (regenerated on build)
- `css/autoprefixed/` - Autoprefixed CSS files (regenerated on build)

### Validation Reports
- `*-report.json` - Lighthouse performance reports
- `*-validation.json` - HTML validation reports
- `compatibility-report.md` - Compatibility validation reports
- `lighthouse-report.json` - Lighthouse reports
- `html-validation.json` - HTML validation results

### Test Files
- `test-*.html` - Temporary test files
- `test-*.js` - Temporary test scripts
- `test-*.css` - Temporary test stylesheets

### Temporary Files
- `*.tmp`, `*.temp` - Temporary files
- `*.log` - Log files (except essential ones)
- `*.cache` - Cache files
- `*.bak`, `*.backup` - Backup files
- `*~` - Editor backup files
- `.DS_Store` - macOS system files

## .gitignore Configuration

The `.gitignore` file has been updated to prevent future clutter:

### Jekyll
```
_site/
.jekyll-cache/
.sass-cache/
.jekyll-metadata
```

### Node.js
```
node_modules/
package-lock.json
yarn.lock
```

### CSS Processing
```
css/purged/
css/autoprefixed/
css/*.min.css
css/*.min.css.map
```

### Testing and Validation
```
*-report.json
*-validation.json
compatibility-report.md
lighthouse-report.json
html-validation.json
test-results/
playwright-report/
```

### System Files
```
.DS_Store
Thumbs.db
*.log
*.tmp
*.bak
```

## Repository Structure (Clean)

```
ctwr-web/
├── _includes/           # Jekyll includes
├── _data/              # Jekyll data files
├── css/                # Source CSS files
│   ├── base/           # Foundation styles
│   ├── components/     # Reusable components
│   ├── pages/          # Page-specific styles
│   └── layout/         # Layout styles
├── js/                 # JavaScript files
├── images/             # Image assets
├── scripts/            # Build and utility scripts
├── tests/              # Test files (if needed)
├── _config.yml         # Jekyll configuration
├── package.json        # Node.js dependencies
├── Gemfile             # Ruby dependencies
├── .gitignore          # Git ignore rules
├── README.md           # Project documentation
└── REPOSITORY_CLEANUP.md # This file
```

## Build Process

### Development
```bash
# Install dependencies
bundle install
npm install

# Start development server
bundle exec jekyll serve --livereload
```

### Production
```bash
# Build for production
JEKYLL_ENV=production bundle exec jekyll build

# Run optimization
npm run optimize:all
```

## Cleanup Commands

### Quick Cleanup
```bash
# Remove build artifacts
rm -rf _site .jekyll-cache css/purged css/autoprefixed

# Remove validation reports
rm -f *-report.json *-validation.json compatibility-report.md

# Remove temporary files
find . -name "*.tmp" -o -name "*.temp" -o -name "*.log" -o -name "*.cache" | xargs rm -f
```

### Full Cleanup
```bash
# Run the cleanup script
./scripts/cleanup-repo.sh
```

## Maintenance Guidelines

### Before Committing
1. **Check for build artifacts** - Ensure no `_site/`, `.jekyll-cache/`, or `css/purged/` directories
2. **Remove temporary files** - Clean up any `*.tmp`, `*.log`, or `*.cache` files
3. **Verify .gitignore** - Ensure new file types are properly ignored
4. **Test build process** - Verify the site builds cleanly from source

### Regular Maintenance
- **Weekly**: Run cleanup commands
- **Before releases**: Full repository audit
- **After major changes**: Verify .gitignore completeness

## File Size Monitoring

### Before Cleanup
- Repository size: ~115MB
- Main contributors: `node_modules/`, `vendor/`, `_site/`

### After Cleanup
- Repository size: ~5MB (estimated)
- Clean source-only repository

## Dependencies

### Required for Development
- Ruby (Jekyll)
- Node.js (CSS processing, testing)
- Git (version control)

### Optional Tools
- Playwright (cross-browser testing)
- Pa11y (accessibility testing)
- Lighthouse (performance testing)

## Troubleshooting

### Common Issues
1. **Build fails after cleanup** - Run `bundle install` and `npm install`
2. **Missing CSS** - Regenerate with `npm run optimize:all`
3. **Jekyll errors** - Clear cache with `rm -rf .jekyll-cache`

### Recovery
```bash
# Restore dependencies
bundle install
npm install

# Rebuild everything
bundle exec jekyll build
npm run optimize:all
```

## Team Guidelines

### For Developers
- **Never commit build artifacts** - They're regenerated automatically
- **Use .gitignore** - Add new file types to prevent future clutter
- **Clean before committing** - Run cleanup commands before pushing
- **Document changes** - Update this file when adding new cleanup rules

### For Contributors
- **Follow the structure** - Place files in appropriate directories
- **Check .gitignore** - Ensure your files aren't being ignored incorrectly
- **Test locally** - Verify the site builds after your changes

## Benefits of Clean Repository

1. **Faster clones** - Smaller repository size
2. **Clearer history** - Only source code changes tracked
3. **Easier maintenance** - No confusion about what to edit
4. **Better collaboration** - Consistent environment for all developers
5. **Reduced conflicts** - No build artifact merge conflicts

## Conclusion

A clean repository is essential for:
- **Maintainability** - Easy to understand and modify
- **Collaboration** - Consistent environment for all team members
- **Performance** - Faster operations and smaller downloads
- **Reliability** - Predictable build and deployment processes

This cleanup process ensures the CivicTech Waterloo Region website repository remains professional, maintainable, and efficient for all contributors.