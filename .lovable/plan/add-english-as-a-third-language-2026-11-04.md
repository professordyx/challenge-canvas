# Add English as a third language

## What changes
- The language switcher gets an "English" option next to Portuguese and Spanish, and the choice is saved to your profile as it is today.
- Every screen gets English text: home page, sign-in, dashboard, canvas editor, sharing window, admin panel, page not found, and the problem statement guide.
- The full User Manual (Design Thinking and Open Innovation) gets an English version.
- The AI features (improve text, evaluate canvas, infographic) answer in English when English is selected, and their error messages also come in English.
- Voice input listens in English (en-US) when English is selected.
- The exported PDF and the page titles in search results also follow the chosen language.

## Technical details
- Extend the language type `'pt' | 'es'` to include `'en'` in `LanguageContext`, `types/challenge.ts`, `translations.ts`, `i18n/admin.ts`, and the canvas section definitions; add `en` entries for every key.
- Add English content blocks to `Manual.tsx` and `ProblemStatementGuide.tsx`.
- Edge functions (`improve-section`, `evaluate-canvas`, `generate-infographic`, `_shared/anthropic.ts`): accept `en` in validation, add English prompts and error messages, then redeploy.
- `useSpeechToText`: map `en` to `en-US`. Date formatting uses an English locale.
- Run the TypeScript check and the existing tests, then check a few screens in English in the browser.
- Update the bilingual memory rule to cover three languages.
