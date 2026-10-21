# Iris Yang — personal website

Bilingual English / Traditional Chinese portfolio, research record, and individual research mentoring website. Built with static HTML, CSS, and JavaScript for GitHub Pages.

## Preview locally

Run `python3 -m http.server 8765 --bind 127.0.0.1` in this directory and open `http://127.0.0.1:8765`.

## Maintain content

- `index.html` contains all content, academic records, links, and structured data. The English version is present in the HTML; `data-zh` holds the corresponding Traditional Chinese HTML. Avoid nesting translated elements.
- `assets/styles.css` contains responsive styles and reduced-motion/print support.
- `assets/script.js` handles language preference, mobile navigation, publication filters, and academic-detail deep links.
- `assets/iris-yang.jpg` is the original portrait, shown in the header, hero, and biography. The seven original research and campus images are restored as separate files, without image modification.
- `assets/visual-refresh.css` restores the navy/gold visual identity, responsive image cards, and hover/entrance effects.
- `assets/visual-effects.js` progressively enhances reading progress, active navigation, and one-time entrance motion; it respects reduced-motion preferences.
- `assets/academic-profile.css` styles education credentials, teaching roles, research citations, and additional portfolio entries.
- `assets/event-details.css` styles the Taiwan–UCLA program feature and original SVG constellation / flight motifs. Existing reveal observation triggers each animation once (under four seconds); reduced-motion and no-JavaScript views show static artwork. No animation libraries or third-party artwork are added.

The page remains readable with JavaScript disabled. With JavaScript enabled, language choice is saved locally in the browser (`site_lang`); no analytics or submission backend is added.

## Content notes

Academic content was reconciled with author-supplied CVs and direct author corrections on October 21, 2026. Doctoral Researcher is the author's requested Purdue title. The two insurance manuscripts are distinct works. Preserve the distinction between completed degrees, ongoing doctoral study, financial-engineering coursework, submitted manuscripts, working manuscripts, and peer-reviewed publications. Do not copy contact details or references from private résumé documents into the site.

The research record has separate filters for publications, submitted/revised manuscripts, projects, and presentations. The NCI and Sikand events are upcoming as of October 21, 2026. Conference acceptance is not proof of proceedings publication. Public project archives and datasets are labeled separately from journal articles. Portfolio proposals and early-stage projects retain their actual stage; the clinical cohort pilot uses synthetic data and is described without a private repository link.

Published article citations were checked against their publisher records. Course titles were checked against Cal State LA's Fall 2026 schedule. Update both languages and the visible record date when a manuscript status, event, credential, or teaching role changes.

The Taiwan–UCLA summer program feature links to the activity homepage and journal. Its July 6–September 3, 2026 dates describe a past program; retain the specific Academic Advisor & Course Coordinator role rather than implying a UCLA faculty appointment.

Mentoring inquiries go directly to the personal email already published on the author's GitHub profile. The Traustia affiliation remains in the biography.

## Deployment

The existing GitHub Pages repository serves the site from its configured publishing branch. Review the change before merging it into that branch.
