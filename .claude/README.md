# Claude Code Configuration for CTWR Website

This directory contains Claude Code agents, commands, hooks, rules, and MCP server configurations to enhance development workflows for the Code The Waterloo Region website.

## Installed Resources

### Agents

Specialized AI agents that provide expert assistance in specific domains.

#### 1. Performance Optimizer Agent
**File:** `agents/performance-optimizer-agent.json`

Expert in application performance optimization, profiling, and system tuning across frontend, backend, and infrastructure.

**Features:**
- Core Web Vitals optimization and frontend performance tuning
- Database query optimization and connection pooling strategies
- Memory leak detection and CPU optimization techniques
- Infrastructure performance tuning with load balancing and caching
- Multi-level caching strategies with Redis and in-memory solutions
- Application performance monitoring and real-time profiling

**When to use:**
- Optimizing website load times
- Improving Core Web Vitals scores
- Analyzing and fixing performance bottlenecks
- Implementing caching strategies

#### 2. Frontend Specialist Agent
**File:** `agents/frontend-specialist-agent.json`

Expert frontend developer specializing in modern JavaScript frameworks, UI/UX implementation, and performance optimization.

**Features:**
- Advanced React development with custom hooks and performance optimization
- Modern state management using Redux Toolkit and RTK Query
- Component-based CSS architecture with design systems
- Performance optimization through code splitting, lazy loading, and virtual scrolling
- Comprehensive accessibility implementation with WCAG compliance
- TypeScript integration for type-safe frontend development

**When to use:**
- Building new features with React
- Implementing responsive designs
- Adding accessibility features
- Optimizing JavaScript bundle size

#### 3. UI/UX Design Expert Agent
**File:** `agents/ui-ux-design-expert-agent.json`

Specialized in creating beautiful, intuitive user interfaces and exceptional user experiences.

**Features:**
- User-centered design methodology and design thinking processes
- Accessibility compliance with WCAG 2.1 guidelines
- Design systems and component library creation
- Responsive and adaptive design for all device types
- User research and usability testing methodologies

**When to use:**
- Designing new pages or components
- Improving user experience
- Conducting accessibility audits
- Creating design systems

### Commands

Custom slash commands for common development tasks.

#### 1. Review Command
**File:** `commands/review.json`

Comprehensive code review with security analysis, performance optimization, and best practices validation.

**Usage:**
```
/review [file_or_directory]
```

**Features:**
- Security vulnerability detection
- Performance optimization suggestions
- Code quality improvements
- Architecture recommendations
- Testing recommendations

**Example:**
```
/review index.html
/review js/
```

#### 2. Git Smart Commit Command
**File:** `commands/git-smart-commit.json`

Intelligently analyzes changes and creates well-formatted git commits with conventional commit messages.

**Usage:**
```
/git-smart-commit [type] [message]
```

**Features:**
- Conventional commit format (feat, fix, docs, style, etc.)
- Automatic change analysis
- Smart file staging
- Breaking change detection

**Example:**
```
/git-smart-commit
/git-smart-commit perf "optimize image loading"
```

### Hooks

Automated scripts that run at specific points in the development workflow.

#### 1. Accessibility Checker Hook
**Files:**
- `hooks/accessibility-checker.json` (config)
- `hooks/accessibility-checker.sh` (script)

Automated accessibility testing and compliance checking for web applications following WCAG guidelines.

**Triggers:** Runs after writing or editing HTML files

**Features:**
- Automated WCAG compliance testing with axe-core
- Color contrast analysis and validation
- Keyboard navigation testing
- Screen reader compatibility checks
- Image accessibility validation (alt attributes)
- Form label validation

**How it works:**
When you edit HTML files, this hook automatically:
1. Checks for missing alt attributes on images
2. Validates form input labels
3. Runs axe-core scan if available
4. Reports accessibility issues

#### 2. Git Pre-Commit Validator Hook
**Files:**
- `hooks/git-pre-commit-validator.json` (config)
- `hooks/git-pre-commit-validator.sh` (script)

Comprehensive pre-commit hook that validates code quality, runs tests, and enforces standards.

**Triggers:** Runs before git commit commands

**Features:**
- Code quality validation with linting and formatting
- Security scanning for secrets and vulnerabilities
- Automated test execution before commits
- File validation and size limits
- Commit message format enforcement

**How it works:**
Before each commit, this hook:
1. Checks for forbidden files (.env, .DS_Store, node_modules)
2. Validates file sizes (warns on files > 10MB)
3. Runs ESLint if configured
4. Runs Prettier formatting checks
5. Executes test suite

### Rules

Global rules that guide Claude's behavior throughout the project.

#### 1. Code Review Expert Rule
**File:** `rules/code-review-expert.json`

Comprehensive code review rules for thorough analysis and constructive feedback.

**Review Priorities:**
1. Security & Safety
2. Code Quality
3. Performance
4. Maintainability

**Effect:**
When this rule is active, Claude will:
- Provide more thorough code reviews
- Focus on security vulnerabilities
- Check for code smells and anti-patterns
- Offer educational explanations

## Project-Specific Recommendations

### For CTWR Website (Jekyll Static Site)

Given this is a Jekyll-based static website, here are the most relevant resources:

**High Priority:**
1. **Performance Optimizer Agent** - For optimizing images, CSS, and JavaScript
2. **Accessibility Checker Hook** - Critical for civic tech projects
3. **Review Command** - For reviewing HTML/CSS/JS changes

**Medium Priority:**
1. **Frontend Specialist Agent** - For JavaScript enhancements
2. **UI/UX Design Expert** - For improving user experience

**Nice to Have:**
1. **Git Smart Commit** - For better commit messages
2. **Git Pre-Commit Validator** - For quality gates (may need customization for Jekyll)

## Usage Tips

### Invoking Agents

To use an agent, reference it in your conversation with Claude:
```
Use the performance-optimizer-agent to help me optimize the website's Core Web Vitals
```

### Using Commands

Commands are invoked with a slash:
```
/review css/style.css
/git-smart-commit
```

### Configuring Hooks

Hooks are automatically triggered based on their matchers. To modify hook behavior, edit the corresponding `.sh` script file.

### Customization

All JSON configuration files can be customized to match your project needs:
- Adjust temperature and maxTokens for different behavior
- Modify hook scripts for project-specific checks
- Update command prompts for different workflows

## Dependencies

Some features require additional tools:

**For Accessibility Checker:**
- `axe-core` - Install with: `npm install -g @axe-core/cli`
- `jq` - For JSON parsing (usually pre-installed on macOS)

**For Pre-Commit Validator:**
- `prettier` - Install with: `npm install -g prettier`
- `eslint` - Install with: `npm install -g eslint`

**For Jekyll Project:**
```bash
# Install Ruby dependencies
bundle install

# Install Node dependencies (if using)
npm install
```

## Next Steps

1. **Test the hooks:** Make an HTML edit and commit to see hooks in action
2. **Try the review command:** `/review index.html`
3. **Use an agent:** Ask Claude to use the performance-optimizer-agent
4. **Customize:** Modify hook scripts for Jekyll-specific checks

## Resources

- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Web Performance Best Practices](https://web.dev/performance/)

## Source

These resources were obtained from the [Claude Pro Directory](https://github.com/JSONbored/claudepro-directory) community repository.
