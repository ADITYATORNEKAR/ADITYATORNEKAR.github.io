# Claude Code Prompts — Portfolio Modernization

How to use: open the `ADITYATORNEKAR.github.io` repo in VS Code, open the Claude Code terminal panel, and paste one prompt at a time. Review the diff and commit before moving to the next — each prompt assumes the previous one is already committed. Fill in every `[BRACKETED]` placeholder before pasting.

Site facts these prompts assume (confirmed from your live source): main page is `index.html`, styles are split across `css/default.css`, `css/layout.css`, `css/media-queries.css`, `css/fonts.css`; brand accent color is `#11ABB0`; the hero uses a looping `<video>` background at `images/header-background.mp4` inside `<header id="home">`; project cards live in the `#portfolio` section (labeled "Technical Lab") using `.portfolio-item` / `.popup-modal` markup; testimonials use FlexSlider; project lightboxes use Magnific Popup; scripts are loaded at the bottom of `index.html` (jQuery 1.10.2, jquery-migrate, flexslider, waypoints, fittext, magnific-popup, init.js).

**Standing constraint for every prompt below:** never remove, replace, or restructure the `<video>` hero background or its `<source src="images/header-background.mp4">`. It stays exactly as-is — all styling/interaction work happens around it, not to it.

**On scope:** most of these prompts are primarily CSS, but a couple require a small amount of markup or a few lines of vanilla JS to actually work (e.g. a toggle button needs a button element; that's normal, not scope creep). If Claude Code flags a scope question like that, approve the small expansion rather than trying to force a JS feature into a CSS-only file.

---

## Prompt 1 — CSS modernization refresh + light/dark toggle

```
Modernize the visual styling of this static portfolio site. Primary scope is css/default.css, css/layout.css, css/media-queries.css, but this prompt also requires small, contained additions to index.html and one new tiny JS file — that's expected, go ahead with it.

Hard constraint: do not touch the <video> element or its source (images/header-background.mp4) inside <header id="home">. Leave that markup completely untouched. Everything else in the header (nav, banner text, social icons) can be restyled.

Do this:
1. Introduce CSS custom properties in :root inside default.css for the palette currently hardcoded throughout the CSS (accent #11ABB0, dark backgrounds #0f0f0f/#161415/#2B2B2B/#191919, text greys #838C95/#7A7A7A/#A1A1A1). Replace hardcoded hex values in layout.css and default.css with var() references to these.
2. Add a light/dark mode toggle:
   - A small button in index.html fixed near the nav (reuse #nav-wrap styling conventions), e.g. <button id="theme-toggle" aria-label="Toggle light/dark theme">.
   - A new file js/theme-toggle.js (referenced at the bottom of index.html alongside the other scripts) that toggles a data-theme="light" attribute on <html> when the button is clicked, and persists the choice in localStorage.
   - An inline script in <head> (a few lines, not a whole file) that reads localStorage before first paint and applies data-theme immediately, to avoid a flash of the wrong theme.
   - Define a light palette as an alternate set of custom properties scoped to [data-theme="light"] in default.css.
3. Modernize .portfolio-item .item-wrap: replace the flat white card with a subtle rounded corner (10-12px), soft box-shadow, and a smoother hover transition (scale 1.02 + shadow lift instead of just the overlay fade).
4. Improve typography rhythm: slightly increase line-height on body copy in #about and #resume, and tighten heading letter-spacing for a cleaner look. Keep the existing font-family declarations (opensans-*, librebaskerville-*) — do not swap fonts yet.
5. Keep every existing selector name intact so init.js and the HTML keep working unmodified. Do not restructure the header/hero markup beyond adding the toggle button.

After: show me a summary of every file you touched, confirm the video hero markup is untouched, and confirm no class names were renamed.
```

---

## Prompt 2 — Apple-style scroll interactions (parallax + reveal-on-scroll)

```
Add subtle, modern scroll-driven interactions to this static site, inspired by Apple product pages (apple.com/iphone-17-pro), scoped to what's realistic for a no-build-tool static site. Do not touch the <video> element/source in the header — you may animate its container, opacity, or transform, but the video markup itself stays as-is.

Add a new file js/scroll-interactions.js, referenced at the bottom of index.html after the other scripts, containing:

1. Hero parallax/fade: as the user scrolls down past <header id="home">, apply a subtle parallax to the banner text (.banner-text) — move it at roughly 0.4x scroll speed and fade its opacity toward 0 by the time the header is scrolled past. Use a scroll listener with requestAnimationFrame (throttle via rAF, don't run heavy work on every raw scroll event) — do not use CSS scroll-timeline/animation-timeline yet since browser support is inconsistent; plain JS + transform/opacity is more reliable here.
2. Scroll-reveal on section entry: sections #about, #resume, #portfolio, #testimonials, #contact should fade + slide up (e.g. translateY(24px) to translateY(0), opacity 0 to 1) the first time they enter the viewport. Implement with IntersectionObserver (threshold ~0.15), adding a class like .in-view once triggered, and define the transition in CSS (layout.css) rather than animating inline styles from JS.
3. Respect prefers-reduced-motion: if the user has that media query set, skip both the parallax and the reveal animation entirely — sections should just be visible with no transform/opacity trickery.
4. Smooth scroll: add scroll-behavior: smooth in default.css as a baseline (the existing smoothscroll JS can stay for older-browser fallback / offset handling — don't remove it).
5. Keep all of this additive and non-blocking: if JS fails to load for any reason, every section should still be fully visible by default (i.e. initial CSS state should not be opacity:0 with visibility depending only on JS — use a class-based approach where the "hidden" state is only applied once JS confirms IntersectionObserver is available).

After: describe the scroll behavior you implemented section by section, and confirm prefers-reduced-motion is respected and there's no failure mode where content stays invisible if JS doesn't run.
```

---

## Prompt 2B — (Optional, later) Full Apple-style scroll-scrubbed hero video

```
This is a bigger, separate effort — only run this once Prompt 2 is committed and you're happy with the lighter parallax version, since it replaces the header's video-playback approach with a scroll-scrubbed image-sequence approach (how Apple does it on product pages).

Do NOT attempt this by trying to control video currentTime via scroll — that's unreliable across browsers for this kind of effect. Instead:
1. I will need to export images/header-background.mp4 as a sequence of frames (e.g. 60-120 JPG/WebP frames) — tell me the ffmpeg command to generate them at a reasonable frame count and file size for a static site (no build pipeline, just static assets in a new images/header-frames/ folder).
2. Once I've generated and added the frames, replace the <video> hero with a <canvas> that draws the current frame based on scroll position within the header's scroll range, preloading frames to avoid flicker.
3. Provide a graceful fallback: if the frames aren't present/loaded yet, keep the original <video> loop as a fallback background.

Wait for me to confirm the frames exist before writing the canvas-scrubbing code — don't generate placeholder frames yourself.
```

---

## Prompt 3 — Replace heavy jQuery plugins with lighter native equivalents

```
Replace two jQuery plugin dependencies in this static site with lightweight vanilla JS, keeping the visual behavior equivalent. Do not introduce a build step — this must stay plain static HTML/CSS/JS deployable via GitHub Pages. Do not touch the header <video> element.

1. Magnific Popup (project modals in #portfolio, markup pattern: <a href="#modal-X" class="popup-modal"> triggering <div id="modal-X" class="popup-modal mfp-hide">):
   - Replace with the native <dialog> element. Each modal div becomes a <dialog id="modal-X">, opened via dialog.showModal() and closed via dialog.close(), triggered by the existing .popup-modal links (update them to call a small openModal(id) helper via a click listener instead of the Magnific Popup hash-link behavior).
   - Preserve the existing .description-box, .categories, .link-box inner markup and CSS as-is so layout.css styling still applies.
   - Remove the magnific-popup.js script tag and css/magnific-popup.css link from index.html, and remove js/magnific-popup.js from the repo if nothing else references it.

2. FlexSlider (testimonials carousel in #testimonials, .flexslider > ul.slides):
   - Replace with a CSS scroll-snap horizontal carousel: .flexslider becomes a flex/overflow-x:auto container with scroll-snap-type: x mandatory, each <li> gets scroll-snap-align: center. Add simple prev/next buttons using the existing icon font already loaded (Font Awesome) that call scrollBy on the container.
   - Remove the .flex-control-nav dots or reimplement them minimally with plain JS + CSS if straightforward; if not, it's fine to drop them.
   - Remove the flexslider script tag and any flexslider-specific CSS blocks in layout.css that are no longer needed, but keep general slide styling that still applies.

3. Update the script tags at the bottom of index.html to remove now-unused plugin files (magnific-popup.js, jquery.flexslider.js) and check js/init.js for any now-dead initialization calls referencing removed plugins — clean those up too, but don't remove smoothscroll/waypoints/fittext logic, those stay.

After: list every file you deleted or stopped referencing, and confirm the modal open/close and carousel scroll still work by describing the interaction flow.
```

---

## Prompt 4 — Restructure "Technical Lab" into a filterable project grid

```
The #portfolio section (labeled "Technical Lab (Science-Focused)") currently shows a "Work in Progress" banner plus a single project tile (Portfolio IQ) in a #portfolio-wrapper grid. Restructure this into a proper filterable project grid that can scale as more projects are added.

1. Add a filter bar above #portfolio-wrapper with tag buttons: "All", "Causal Inference", "Agentic AI", "Web / Sports Analytics". Style them as pill buttons consistent with the accent color custom property introduced earlier (var(--accent) or similar; use #11ABB0 directly if that prompt hasn't run yet).
2. Give each .portfolio-item a data-tags attribute (space-separated, e.g. data-tags="causal-inference agentic-ai"). Tag Portfolio IQ as data-tags="causal-inference agentic-ai".
3. Add a small vanilla JS filter script (new file js/portfolio-filter.js, referenced at the bottom of index.html) that shows/hides .portfolio-item elements based on the active filter button, with a simple fade transition using the existing overlay transition timing as a reference (0.3s ease-in-out).
4. Keep the "Work in Progress" copy but shrink it into a smaller inline note below the filter bar rather than a full-width banner, since there will now be real project tiles beneath it.
5. Do not touch the modal markup pattern (that's handled by other prompts) — just get the grid/filter shell in place so new .portfolio-item + modal pairs can be dropped in.

After: confirm the filter buttons and data-tags wiring, and note where in index.html new project tiles should be inserted going forward.
```

---

## Prompt 5 — Add FIFA project tile + modal

```
Add a new project tile to the #portfolio-wrapper grid (same .portfolio-item / popup-modal pattern used by the existing "Portfolio IQ" entry — look at that block in index.html as the template to copy).

Project details:
- Title: FIFA World Cup Predictions
- Description: [1-2 SENTENCES: what the project does, e.g. models used, data sources, what it predicts]
- Repo link: [GITHUB REPO URL, or omit the "Explore Repository" link if not public yet]
- Tags (data-tags attribute, reuse the filter categories from the grid restructure): [e.g. "web-sports-analytics" or add a new tag if it doesn't fit existing categories]
- Card thumbnail image: [PATH TO IMAGE — if you don't have one yet, generate a simple placeholder: reuse the existing images/portfolio/ directory convention (images/portfolio/fifa-predictions.jpg for the card, images/portfolio/modals/m-fifa-predictions.jpg for the modal) and tell me you need me to drop in real screenshots later]
- Categories list inside the modal's .categories block (3 short bullet-style feature highlights): [e.g. "Match outcome prediction model", "Historical World Cup data pipeline", "Interactive results dashboard"]

Follow the exact same HTML shape as the Portfolio IQ tile and modal (same classes: .portfolio-item, .item-wrap, .overlay, .portfolio-item-meta, and the modal's .popup-modal, .description-box, .categories, .link-box). Insert the tile into #portfolio-wrapper and the modal alongside the existing #modal-portfolio-iq modal.

After: show me the exact HTML you inserted so I can confirm the copy before committing.
```

---

## Prompt 6 — Add "A/B Testing & Causal Learning" placeholder tile

```
Add a placeholder project tile to the #portfolio-wrapper grid, same pattern as the other project tiles, for a site I'm still building.

Title: A/B Testing & Causal Learning Lab
Description: A learning-in-public project covering experimental design, A/B testing methodology, and causal inference techniques (uplift modeling, double ML, causal discovery) — written up as tutorials and worked examples.
Status: mark this visually as "In Progress" — reuse whatever pattern makes sense (a small badge/label on the card, e.g. a "Coming Soon" ribbon in the corner of .item-wrap, styled with the accent color).
Tags: causal-inference
Repo/link: use "#" for now instead of a real GitHub link — don't render a broken "Explore Repository" link, either omit it or grey it out with a "Coming soon" label instead of a working link.
Thumbnail: generate a placeholder following the same images/portfolio/ naming convention (images/portfolio/ab-testing-causal-lab.jpg + modals/m-ab-testing-causal-lab.jpg) and flag that I need to swap in a real image later.

Follow the same HTML shape as the other portfolio tiles/modals. Insert it into #portfolio-wrapper and add its modal.

After: show me the HTML you inserted.
```

---

## Prompt 7 — Verification pass

```
Do a full check of index.html and the css/ and js/ files after all the above changes:
1. Serve the site locally (e.g. `python3 -m http.server` from the repo root) and list any console errors you'd expect from removed script/CSS references that are still linked in <head> or at the bottom of index.html.
2. Confirm the header <video> and images/header-background.mp4 reference are completely unchanged from the original.
3. Confirm every .popup-modal trigger link has a matching <dialog id="..."> (or modal div, depending on which prompts you've run) and there are no orphaned #modal-X references.
4. Confirm the filter bar's data-tags values match exactly across all .portfolio-item elements (no typos causing a tile to never show/hide correctly).
5. Confirm scroll-interactions.js degrades gracefully (sections aren't stuck invisible if JS fails) and prefers-reduced-motion is honored.
6. Check css/media-queries.css still makes sense for any new markup added (theme toggle button, portfolio filter bar, "Coming Soon" badge) — add mobile-width rules if something added in earlier prompts doesn't already have responsive handling.
7. Confirm no leftover references to jquery.flexslider.js or magnific-popup.js/css remain anywhere in index.html if Prompt 3 was run.

Report back a punch list: what's confirmed working, and what still needs a manual look in a browser.
```

---

### Notes
- These prompts intentionally avoid introducing a build step (React/Astro/etc.) since the current site is zero-tooling and deploys straight from GitHub Pages — this keeps that deployment model intact.
- Run order: 1 → 2 → 3 → 4 → 5 → 6 → 7. Prompt 2B (scroll-scrubbed video) is optional and separate — only do it later if you want the full Apple-level effect and are willing to export/host a frame sequence.
- If you'd rather skip the plugin-replacement step (Prompt 3) and just do the visual refresh + scroll effects + new project tiles, run 1, 2, 4, 5, 6, 7 and skip 3 — nothing downstream depends on it.
- Fill in the FIFA project bracketed fields in Prompt 5 with real details (or paste your repo README into the Claude Code chat first and ask it to draft the description from that) before running it.
