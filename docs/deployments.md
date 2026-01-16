# Deployments

## Production

Production deploys are handled by `Deploy Website` in `.github/workflows/deploy.yml`.
This runs on pushes to `main`, builds the site with `JEKYLL_ENV=production`, and
publishes to GitHub Pages. The custom domain is configured via `CNAME` at the
repo root, so production resolves at https://civictechwr.org.

## Preview Deploys

Preview deploys are handled by `Preview Deploy` in `.github/workflows/preview-deploy.yml`.
They publish to the `gh-pages-preview` branch and are intended for PR testing.

Preview URL format:

```
https://civictechwr.github.io/ctwr-web/pr-<PR_NUMBER>/
```

Notes:
- PR previews use `pr-<number>` paths for stability.
- The preview workflow removes `_site/CNAME` so `github.io` previews do not
  redirect to the custom domain.
- The PR comment posted by `github-actions[bot]` includes the preview URL.

## Troubleshooting

- If the preview URL is a 404, confirm the `Preview Deploy` workflow succeeded
  and that the URL matches the `pr-<number>` format.
- If a preview redirects to the custom domain, check that `_site/CNAME` is
  removed in the preview workflow.
