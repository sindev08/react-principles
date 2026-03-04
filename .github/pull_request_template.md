## What does this PR do?

<!-- Brief description of the change -->

## Checklist

- [ ] TypeScript strict — no `any`
- [ ] Component anatomy followed (imports → types → constants → component → export)
- [ ] No direct imports between features (use `shared/` for cross-cutting)
- [ ] No `console.log` in production code

**If this adds a new recipe:**
- [ ] Includes: principle, rules, pattern, implementation
- [ ] `demoKey` set in `detail-data.ts` (if live demo included)
- [ ] Recipe added to cookbook list data

**If this changes existing UI:**
- [ ] Tested in both light and dark mode
