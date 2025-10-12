# Contributing to CivicTech Waterloo Region Website

Thank you for your interest in contributing to the CivicTech Waterloo Region website! We welcome contributions from the community and appreciate your help in making our website better.

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes** - Fix issues and improve stability
- **New features** - Add functionality that benefits the community
- **Documentation** - Improve guides, comments, and README files
- **Design improvements** - Enhance UI/UX and accessibility
- **Performance optimizations** - Make the site faster and more efficient
- **Accessibility improvements** - Ensure the site is usable by everyone

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ctwr-web.git
   cd ctwr-web
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/CTWR-Org/ctwr-web.git
   ```
4. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

### Development Setup

1. **Install dependencies**:
   ```bash
   # Install Ruby dependencies
   bundle install
   
   # Install Node.js dependencies
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run serve
   ```

3. **Run tests** to ensure everything works:
   ```bash
   npm run test
   ```

## 📋 Development Guidelines

### Code Style

- **HTML**: Use semantic HTML5 elements and proper indentation
- **CSS**: Follow BEM methodology and use CSS custom properties
- **JavaScript**: Use modern ES6+ features and meaningful variable names
- **Commits**: Use conventional commit messages (see below)

### Accessibility Standards

- **WCAG 2.1 AA** compliance is required
- All images must have descriptive `alt` text
- Interactive elements must be keyboard accessible
- Color contrast must meet 4.5:1 ratio minimum
- Use semantic HTML elements appropriately

### Performance Requirements

- **Lighthouse Score**: Maintain 90+ score
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Testing Requirements

Before submitting a pull request, ensure:

- [ ] All tests pass (`npm run test`)
- [ ] Code is properly linted (`npm run lint`)
- [ ] Accessibility tests pass (`npm run test:accessibility`)
- [ ] Security audits pass (`npm run test:security`)
- [ ] The site builds successfully (`npm run build:prod`)

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch** with the latest changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all tests** and fix any issues:
   ```bash
   npm run test
   ```

3. **Test your changes** thoroughly:
   - Test on different browsers
   - Test on mobile devices
   - Test with keyboard navigation
   - Test with screen readers

### Submitting a Pull Request

1. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title describing the changes
   - Detailed description of what was changed and why
   - Reference any related issues
   - Screenshots for UI changes
   - Testing instructions

3. **Fill out the PR template** completely

### PR Review Process

- **Automated checks** must pass (CI, linting, tests)
- **Code review** by maintainers
- **Accessibility review** for UI changes
- **Performance review** for significant changes
- **Security review** for sensitive changes

## 📝 Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat: add dark mode toggle to navigation
fix: resolve mobile menu accessibility issue
docs: update contributing guidelines
style: format CSS according to stylelint rules
perf: optimize image loading with lazy loading
```

## 🐛 Reporting Issues

### Before Reporting

1. **Check existing issues** to avoid duplicates
2. **Test on latest version** of the site
3. **Try to reproduce** the issue consistently

### Issue Template

When reporting an issue, include:

- **Clear title** describing the problem
- **Detailed description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Browser/device information**
- **Console errors** if any

### Bug Report Labels

- `bug`: Something isn't working
- `accessibility`: Accessibility issue
- `performance`: Performance problem
- `security`: Security concern
- `ui/ux`: User interface issue
- `documentation`: Documentation problem

## 🎨 Design Contributions

### Design Guidelines

- **Consistent with brand** colors and typography
- **Mobile-first** responsive design
- **Accessible** color contrasts and interactions
- **Performance-conscious** image optimization

### Design Process

1. **Discuss major changes** in an issue first
2. **Create mockups** or wireframes
3. **Get feedback** from the community
4. **Implement** with proper testing
5. **Document** design decisions

## 🔧 Technical Contributions

### Code Organization

- **Modular structure** with clear separation of concerns
- **Reusable components** in `_includes/`
- **Consistent naming** conventions
- **Comprehensive comments** for complex logic

### Performance Considerations

- **Minimize HTTP requests**
- **Optimize images** (WebP format, appropriate sizing)
- **Use critical CSS** for above-the-fold content
- **Implement lazy loading** for below-the-fold content
- **Minify assets** for production

## 📚 Documentation

### Documentation Standards

- **Clear and concise** explanations
- **Code examples** where helpful
- **Screenshots** for UI changes
- **Keep README updated** with new features

### Types of Documentation

- **Code comments** for complex logic
- **README updates** for new features
- **API documentation** for JavaScript functions
- **Setup guides** for new contributors

## 🏷️ Release Process

### Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared

## 💬 Community Guidelines

### Code of Conduct

- **Be respectful** and inclusive
- **Be constructive** in feedback
- **Be patient** with newcomers
- **Be collaborative** in discussions

### Communication

- **GitHub Issues** for bug reports and feature requests
- **GitHub Discussions** for general questions and ideas
- **Pull Request comments** for code review
- **Email** for sensitive matters

## 🆘 Getting Help

### Resources

- **Documentation**: Check the `docs/` folder
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers directly if needed

### Common Questions

**Q: How do I set up the development environment?**
A: Follow the setup instructions in the README.md file.

**Q: My tests are failing, what should I do?**
A: Check the error messages, ensure all dependencies are installed, and run `npm run test` to see detailed output.

**Q: How do I add a new page?**
A: Create an HTML file in the root directory and add it to the navigation in `_data/navigation.yml`.

**Q: How do I optimize images?**
A: Use WebP format, appropriate sizing, and implement lazy loading for below-the-fold images.

## 🎉 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **Community acknowledgments** in meetings
- **GitHub contributor** statistics

## 📞 Contact

- **GitHub Issues**: For bug reports and feature requests
- **Email**: civictechwr@gmail.com
- **Website**: [civictechwr.org](https://civictechwr.org)

---

Thank you for contributing to CivicTech Waterloo Region! Your efforts help us build a better community through technology. 🚀
