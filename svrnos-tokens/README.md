# @svrnos/tokens

Shared design tokens for **svrnos.com**, **sim95.com**, and **kingsango.com**.

See [DESIGN.md](./DESIGN.md) for the full design system reference.

## Files

| File | Purpose |
|---|---|
| `tokens.css` | All `--svrnos-*` CSS custom properties. Imports light values; `.dark` / `[data-theme="dark"]` triggers the dark ramp. |
| `tokens.ts` | Same values as TypeScript constants for JS-side consumers (chart palettes, runtime theming). |
| `DESIGN.md` | Full system reference, scale, component grammar, consumer instructions. |
| `specimen/index.html` | Live font + token specimen, light + dark side-by-side. |

## Quick start

```css
/* In your site's globals.css */
@import "@svrnos/tokens/tokens.css";
```

```html
<div style="background: var(--svrnos-bg-page); color: var(--svrnos-text-heading);">
  Hello.
</div>
```

```ts
import { brand } from "@svrnos/tokens";
const accent = brand.primary;
```

## Specimen

Open `specimen/index.html` in a browser to see every token rendered.
