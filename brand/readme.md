# MKG Egg Farm — brand assets

## Logo files (`logo/`)

| File | Use |
| --- | --- |
| `mkg-logo-primary.svg` | Default. Egg outline, MKG breaking through it, EGG FARM + MOKHOTLONG · LESOTHO inside. |
| `mkg-logo-mark-only.svg` | Tight spaces — favicon source, app icon, stamp. No sub-lines. |
| `mkg-logo-reversed.svg` | On dark grounds (`--mkg-neutral-900`). |
| `mkg-logo-mono-black.svg` | One-colour print, fax, embossing, laser. |
| `mkg-logo-mono-gold.svg` | One-colour gold on light. |
| `mkg-logo-with-hen.svg` | Full story mark — sitting hen on the shell. Use at 50 mm / 190 px wide and above. |
| `mkg-logo-with-hen-reversed.svg` | Same, on dark. |
| `mkg-hen-only.svg` | Hen as a standalone device — crate stencil, feed book, bullet, favicon. |

**Before print or final web build:** the SVGs set MKG as live `<text>` in Cormorant Garamond and pull the font from Google Fonts. That is fine for the website (the font loads anyway), but for print or any system without web fonts, open each file once and convert the text to outlines.

**Clear space:** keep a margin equal to the height of the M on all sides. **Minimum size:** 32 px / 12 mm wide for the mark-only file; 190 px / 50 mm for the hen versions.

**Don't:** fill the egg with gold, add a drop shadow, put the logo on a busy photo without a plain panel behind it, or set MKG in another typeface.

## PNG (`logo/png/`)

Raster versions of the five 5c variants at 3× (about 2280 px wide), each on its intended background — primary, mark-only, reversed on #2d2b2b, one-colour black on white, one-colour gold. Use these for slides, WhatsApp, social profiles and print shops that won't take SVG. **For the website use the SVGs** — sharp at any size and a fraction of the weight.

## Colour (`mkg-tokens.css`)

One accent — gold `#b68235` — on a soft near-white ground `#f3f2f2` with near-black ink `#201f1d`. Gold is a **stroke** colour: rules, borders, underlines, icons, small marks. It is not a fill, and not a background for large areas.

Contrast note: gold on the light ground is about 3:1 — enough for icons, large headings and interface chrome, **not** for paragraph text. For body copy in gold use `--mkg-gold-700` (#7d5411).

Dark sections use `--mkg-neutral-900` (#2d2b2b) with `--mkg-gold-400` (#e1ad66) as the accent, since the base gold goes muddy on near-black.

## Type

Cormorant Garamond for display and headings (weight 400 — avoid bold; the bigger the text, the lighter it sets). Lora for body copy at 1.7 line-height. Both load from Google Fonts in `mkg-tokens.css`. Set numbers tabular (`font-feature-settings: "tnum"`) in tables, prices, dates and figures — leave running prose alone.

## Getting started

```html
<link rel="stylesheet" href="/brand/mkg-tokens.css">
<img src="/brand/logo/mkg-logo-primary.svg" alt="MKG Egg Farm" width="260">
```
