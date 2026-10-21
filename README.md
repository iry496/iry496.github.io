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

The page remains readable with JavaScript disabled. With JavaScript enabled, language choice is saved locally in the browser (`site_lang`); no analytics or submission backend is added.

## Content notes

Publication statuses are carried over from the previous website, not inferred from repository names or conference pages. Update both languages when a manuscript status or event changes. The NCI event is marked accepted/upcoming as of October 21, 2026. Public project archives and datasets are labeled separately from peer-reviewed publications.

Mentoring inquiries go directly to the personal email already published on the author's GitHub profile. The Traustia affiliation remains in the biography.

## Deployment

The existing GitHub Pages repository serves the site from its configured publishing branch. Review the change before merging it into that branch.
