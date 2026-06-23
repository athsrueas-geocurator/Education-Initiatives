# Education Evidence Dossier - Codex Instructions

## Product goal
Build a guided-tour research website about U.S. education initiatives and philosophical dichotomies in school reform. The main user experience is the continuum view: for each debate, show where the evidence points, how confident the synthesis is, and which sources support it.

## Source of truth
Use the attached workbook `learning_outcomes_initiatives_deep_dive.xlsx` as the seed source. Convert its sheets into structured JSON in `content/`. Do not hardcode claims directly into page components.

## Editorial rules
- Every major factual claim must link to a source.
- Clearly distinguish evidence from editorial synthesis.
- Do not make any dichotomy look fully settled unless the underlying evidence is unusually strong.
- Do not use clickbait. Use provocative claims only when they are directly source-backed.
- The continuum dot is a synthesis indicator, not a mathematical estimate.

## Architecture rules
- Use TypeScript.
- Keep reusable evidence UI in `src/components/evidence/`.
- Keep dossier/editorial layout components in `src/components/dossier/`.
- Keep validation and normalization logic in `src/lib/`.
- Keep content in `content/*.json`.
- Do not parse the Excel workbook in the browser.
- Prefer static generation and fast page loads.
- Do not add a database or CMS unless explicitly asked.

## UI rules
- Build a premium editorial dossier aesthetic.
- Use accessible contrast.
- Support keyboard navigation.
- Respect reduced-motion preferences.
- Use subtle motion only when it clarifies reading flow.
- Make mobile layouts first-class.

## Evidence model
Each dichotomy needs:
- left pole
- right pole
- evidence position from 0 to 100
- uncertainty band
- confidence level
- evidence strength
- plain-language synthesis
- caveats
- related initiatives
- source IDs

## Validation
Before completion, run:
- lint
- typecheck
- build

Report:
- files changed
- commands run
- any unresolved content gaps
- any sources that need manual verification
