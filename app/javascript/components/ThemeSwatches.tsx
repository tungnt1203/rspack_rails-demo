import { useState } from "react"
import * as swatches from "./ThemeSwatches.module.scss"
import * as badge from "./Badge.module.css"

const SHADES = [1, 2, 3, 4, 5, 6]

// Styled only by CSS modules: ThemeSwatches.module.scss (Sass) and
// Badge.module.css. The class names shown are what rspack generated.
export default function ThemeSwatches() {
  const [selected, setSelected] = useState(3)
  const swatchClass = (shade: number) =>
    [swatches.swatch, swatches[`shade-${shade}`], shade === selected && swatches.selected].filter(Boolean).join(" ")

  return (
    <div className="space-y-3">
      <div className={swatches.grid}>
        {SHADES.map((shade) => (
          <button
            key={shade}
            type="button"
            aria-label={`Shade ${shade}`}
            className={swatchClass(shade)}
            onClick={() => setSelected(shade)}
          />
        ))}
      </div>
      <p className="text-sm text-slate-600">
        Selected button's classes:{" "}
        <span className={badge.badge}>
          <code>{swatchClass(selected)}</code>
        </span>
      </p>
    </div>
  )
}
