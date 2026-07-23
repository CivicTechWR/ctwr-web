.PHONY: all help install build lint test e2e ci serve groundtruth clean

all: build ## Default target: build the site

help: ## Show this help
	@echo "Available targets: all install build lint test e2e ci serve groundtruth clean"

install: ## Install Ruby gems and npm dependencies
	bundle install
	npm ci

build: ## Build the production site (minify assets, JEKYLL_ENV=production)
	npm run build:prod

lint: ## Run all linters (css, markdown, yaml, json, shell, csp)
	npm run lint

test: ## Run the CSS and Luma test suites
	npm run test

e2e: ## Run the Playwright end-to-end test suite
	npm run test:e2e

ci: lint test build e2e ## Run the full local CI rehearsal

serve: ## Start the local Jekyll dev server with livereload
	npm run serve

groundtruth: ## Regenerate ground-truth.json from current repo state
	bash scripts/generate-ground-truth.sh > ground-truth.json

clean: ## Remove local build byproducts
	rm -rf _site lighthouse-report.json css-analysis.json
