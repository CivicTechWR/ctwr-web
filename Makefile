.PHONY: all help install css build lint test audit e2e a11y ci serve groundtruth clean

all: build ## Default target: build the site

help: ## Show this help
	@grep -E '^[a-z0-9_-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-12s %s\n", $$1, $$2}'

install: ## Install Ruby gems and npm dependencies
	bundle install
	npm ci

css: ## Rebuild css/main.css from css/src/ and re-minify (run after editing css/src/)
	npm run build:css
	npm run minify:css

build: ## Build the production site (minify committed assets, JEKYLL_ENV=production; does NOT rebuild css/src - use make css)
	npm run build:prod

lint: ## Run all linters (css, markdown, yaml, json, shell, csp)
	npm run lint

test: ## Run the CSS, CSS asset/budget, Luma and JS test suites
	npm run test

audit: ## Run the dependency scans CI runs (npm audit --audit-level=critical, bundler-audit)
	npm audit --audit-level=critical
	bundle exec bundler-audit check --update

e2e: ## Run the Playwright end-to-end suite (needs a fresh build; make ci builds first)
	npm run test:e2e

a11y: ## Run pa11y-ci against the built site on 127.0.0.1:4000 (needs a fresh build and Chrome)
	@bash -c 'set -euo pipefail; \
		bundle exec jekyll serve --no-watch --skip-initial-build --host 127.0.0.1 --port 4000 >/dev/null 2>&1 & pid=$$!; \
		trap "kill $$pid 2>/dev/null || true" EXIT; \
		for _ in $$(seq 30); do curl -fs -o /dev/null http://127.0.0.1:4000/ && break; sleep 1; done; \
		npx pa11y-ci --config .pa11yci.json'

ci: lint test audit build e2e ## Run the local CI rehearsal (add make a11y for the accessibility job)

serve: ## Start the local Jekyll dev server with livereload
	npm run serve

groundtruth: ## Regenerate ground-truth.json (gitignored) from current repo state
	bash scripts/generate-ground-truth.sh > ground-truth.json.tmp && mv ground-truth.json.tmp ground-truth.json || { rm -f ground-truth.json.tmp; exit 1; }

clean: ## Remove local build byproducts and generated reports
	rm -rf _site test-results playwright-report lighthouse-report.json css-analysis.json ground-truth.json ground-truth.json.tmp
