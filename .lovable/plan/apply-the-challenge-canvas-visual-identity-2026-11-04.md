# Apply the "challenge canvas" visual identity

## What changes
- **New logo everywhere:** the Diocélio Goulart logo in the top bar, sign-in page, manual and PDF cover is replaced by the new "challenge canvas" logo (three navy squares plus a teal circle, next to the name in lowercase, "challenge" bold and "canvas" regular in teal).
  - Horizontal version: top bar, sign-in, manual, PDF header.
  - Symbol only: browser tab icon (favicon) and the logo used by search engines.
  - White version on dark backgrounds (dark mode), following the manual's light/dark rules.
- **App name:** "Challenge Canvas Builder" becomes "Challenge Canvas" in page titles, search descriptions, the home page, guides, manuals (PT/ES/EN), the PDF and the AI summary for search engines. The logo itself is always written "challenge canvas" in lowercase.
- **Colors:** the palette moves to the manual's colors: navy #284362, teal #2B6F67, teal 300 #5C9189, teal 100 #D6E4E2, ink #0E1722. The previous green accent is replaced by teal.
- **Fonts:** titles in Exo 2, body text, labels and buttons in Inter, as the manual requires (replacing Archivo and Rubik).
- **Author credit:** "Desenvolvido por Diocélio Goulart · dioceliogoulart.com.br" stays as text in the footer and PDF, without his logo.
- **Social preview image:** regenerated with the new logo and colors.

## Technical details
- Build the logo as a small SVG component (`BrandLogo`, variants `horizontal | vertical | symbol`, tone `color | white | mono`) drawn on the 48-unit grid from the manual (20u squares, 4u radius, 4u gap, 10u-radius circle in the top-right). Wordmark text uses Exo 2 so it stays sharp and themable.
- Export `public/favicon.svg` and `public/logo.png` (white symbol on teal for the app icon, per section 10); remove `public/favicon.ico`; update `index.html` icon, title, meta, JSON-LD.
- Update `src/index.css` tokens (light, dark, print) and the Google Fonts import; update `tailwind.config.ts` font families.
- Replace imports of `logo-diocelio.png` in Header, Auth, Manual, CanvasEditor; keep the file unused-free (delete it).
- Rename strings across translations, pages, `llms.txt`, Helmet titles.
- Update memory: identity name and design (palette, fonts) now follow the challenge canvas manual.
- Verify with screenshots of the home, sign-in and canvas pages in light and dark mode.
