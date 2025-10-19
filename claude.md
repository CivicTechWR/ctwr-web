# CivicTech Waterloo Region – Claude Code Project Guide

**Project:** CivicTechWR Jekyll Website
**Branch:** perf/perf-improvements
**Last Updated:** October 18, 2025
**Tech Stack:** Jekyll, HTML, CSS, JavaScript, Bootstrap 4.1.3
**Current Branch:** perf/bootstrap-optimization

---

## Mission Objectives (Non-Negotiable)

1. **Clean codebase** — zero merge conflicts, consistent structure, and no redundancy.
2. **Responsive and adaptive design** — renders correctly across all breakpoints and devices.
3. **Best practices first** — HTML, CSS, and JS must align with modern web standards.
   - Claude will use its **connected MCP servers** (file system, search, performance, linting) and **web-design-specialist**, **code-reviewer**, and **performance-optimizer** agents for research and validation.
4. **Consistent design system** — unified components, BEM class naming, and no “snowflake” elements.
5. **Full code review** — deep inspection of CSS, JS, and HTML for logic, maintainability, and accessibility.
6. **Dead code removal** — delete all unused selectors, scripts, inline styles, and orphaned includes.

**Claude must**:

- Rely on connected **agents and MCP tools** for every step of refactoring, rather than local assumptions.
- Pull examples, specs, or references dynamically via **search and validation agents**.
- Justify significant changes with reasoning and code diffs.

---

## Project Context

CivicTechWR is a volunteer-driven civic tech community hub. The website highlights projects, events, and people improving life in Waterloo Region through technology and collaboration.

**Live Site:** https://civictechwr.org
**Audience:** Technologists, designers, and community builders in Kitchener-Waterloo.

---

## Core Workflow for Claude Sessions

Each new Claude Code session must begin with a **setup phase** to reload environment context and agent access.

### Initialization Phase

Claude should:

1. Connect to MCP servers:
   - `filesystem`
   - `search`
   - `performance`
   - `linting`
   - `sequential-thinking`
2. Confirm access to agents:
   - `web-design-specialist` – for responsive layout and CSS refactoring
   - `code-reviewer` – for deep code analysis and cleanup
   - `performance-optimizer` – for Core Web Vitals and bundle performance checks
3. Verify repository path and branch:
   ```bash
   git status
   git branch
   ```
4. Load this file (`claude.md`) as project guide context.

---

## Responsibilities by Agent

| Agent                         | Responsibility                                                       | When to Use                                         |
| ----------------------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| **web-design-specialist**     | Enforce responsive layout, visual parity, CSS modularity.            | During UI refactor and component extraction.        |
| **code-reviewer**             | Perform static analysis, linting, and dead code detection.           | Before every commit.                                |
| **performance-optimizer**     | Measure load time, memory use, bundle size; recommend optimizations. | Before each merge to main.                          |
| **search** (MCP)              | Fetch docs, specs, or best-practice references.                      | When design or accessibility standards are unclear. |
| **filesystem** (MCP)          | Read/write/compare local files.                                      | For automated cleanup and validation scripts.       |
| **sequential-thinking** (MCP) | Plan multi-step actions logically.                                   | For multi-file refactor tasks (e.g. CSS splitting). |

---

## Full Code Review Mandate

Claude should perform a **complete audit** before major merges:

### Deliverables:

- Comprehensive **CSS, JS, and HTML review**
- List of **orphaned files** and **duplicate selectors**
- **Performance benchmark** (Chrome memory <50 MB target)
- **Accessibility validation** (contrast, alt text, ARIA roles)
- **Security sanity check** (no inline JS injection risks)

Claude may call:

```bash
# Run linting and validation pipeline
bash scripts/validate-css.sh
npm run lint
```

---

## Claude’s Operating Principles

1. **Refactor incrementally** — One component per commit.
2. **Preserve visual parity** — Screenshots before/after required if changes affect layout.
3. **No `!important` patches** — Fix specificity properly.
4. **No inline styles** — Move all styles to component files.
5. **Accessibility is mandatory** — Validate with WCAG 2.1 AA checks.
6. **Rollback immediately if regression is detected.**

---

## Continuous Improvement Loop

Claude should always run in a **review-improve-validate** loop:

```text
1. Analyze → 2. Refactor → 3. Validate → 4. Document → 5. Commit
```

Validation relies on:

- MCP filesystem diffing
- Live visual test scripts
- Performance-optimizer profiling
- Accessibility agent checks (contrast, tab order, ARIA)

---

## Claude’s Reporting Format

For each refactor or review, output the following in Markdown:

```markdown
### Summary

Brief description of what changed and why.

### Files Updated

- css/components/buttons.css
- index.html
- about.html

### Improvements

- Reduced CSS size by 7 KB
- Eliminated 12 `!important` declarations
- Unified hover states

### Next Steps

1. Test mobile navigation.
2. Run performance-optimizer agent.
3. Commit if passes validation.
```

---

## Commit Standards

```bash
git commit -m "refactor: [component] - describe what changed

- Key improvement summary
- Zero regressions
- Generated and validated with Claude Code agents"
```

---

## Collaboration Mode

When multiple agents operate simultaneously (e.g., `web-design-specialist` + `performance-optimizer`):

- Claude orchestrates sequencing using `sequential-thinking`.
- Each agent’s output must be logged into `/tmp/claudepro-directory/reports/YYYY-MM-DD/`.

---

## Validation Metrics

| Category                  | Metric             | Target                          |
| ------------------------- | ------------------ | ------------------------------- |
| Memory usage              | Chrome heap        | < 50 MB                         |
| CSS size                  | Total combined     | < 100 KB                        |
| `!important` declarations | Count              | ≤ 14 (bootstrap utilities only) |
| Accessibility             | WCAG 2.1 AA        | Pass                            |
| Core Web Vitals           | Lighthouse         | ≥ 90 score                      |
| Build integrity           | Jekyll serve/build | No warnings                     |

---

## Emergency Recovery

If build breaks or regressions occur:

```bash
git restore .
bundle exec jekyll clean
bundle exec jekyll serve
```

Then report using this structure:

```markdown
### Issue Detected

Describe what failed and when.

### Agent Context

Which agent last modified the files?

### Proposed Fix

How to revert or re-run the step safely.
```

---

## Next Step Trigger Commands

### For Claude (Start of Session)

```bash
# Start a new cleanup and refactor session
claude --project civictechwr --agents web-design-specialist,code-reviewer,performance-optimizer --goal "CSS and JS cleanup per claude.md"
```

### Common Quick Tasks

| Task                             | Command                                       | Responsible Agent     |
| -------------------------------- | --------------------------------------------- | --------------------- |
| Remove `!important` declarations | `claude run --fix specificity`                | code-reviewer         |
| Split `style.css`                | `claude refactor --split components`          | web-design-specialist |
| Audit performance                | `claude run --audit performance`              | performance-optimizer |
| Delete orphaned CSS              | `claude clean --dead-code`                    | code-reviewer         |
| Verify responsiveness            | `claude test --screens mobile tablet desktop` | web-design-specialist |

---

## Summary

Claude Code is expected to:

- Maintain a **clean, performant, accessible** CivicTechWR codebase.
- Use **all connected MCP servers** and **agents** to validate every change.
- Produce **auditable, traceable results** with minimal manual intervention.
- Never rely on guesswork — always confirm via data, standards, and agent collaboration.

---

**Last Updated:** October 18 2025
**Next Review:** After completion of navigation and hero component extraction.
