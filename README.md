# The Education Evidence Dossier

A static Next.js guided-tour website generated from `learning_outcomes_initiatives_deep_dive.xlsx`.

## Local development

```bash
npm install
npm run content
npm run dev
```

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

The build validates `content/*.json`, statically generates all routes, and writes the GitHub Pages-ready output to `out/`.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds and deploys `out/` to GitHub Pages.

If the repository is served from a project path such as `/education-evidence-dossier`, set the repository variable `NEXT_PUBLIC_BASE_PATH` to that path in GitHub. Leave it blank for a user/org Pages domain or a custom domain.
