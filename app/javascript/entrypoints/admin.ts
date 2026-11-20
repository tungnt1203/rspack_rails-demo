// The "admin" entry (layouts/admin.html.erb). Only what this page needs:
// a table of the files the browser downloaded, from the Resource Timing API.
import "@fontsource-variable/familjen-grotesk"
import "@fontsource/ibm-plex-sans/400.css"
import "@fontsource/ibm-plex-sans/500.css"
import "@fontsource-variable/jetbrains-mono"

const kb = (bytes: number) => (bytes ? `${(bytes / 1024).toFixed(1)} KB` : "cached")

const render = () => {
  const body = document.querySelector<HTMLTableSectionElement>("[data-admin-resources]")
  if (!body) return
  const entries = [
    ...(performance.getEntriesByType("navigation") as PerformanceResourceTiming[]),
    ...(performance.getEntriesByType("resource") as PerformanceResourceTiming[]),
  ].filter((entry) => !entry.name.includes("hot-update"))

  body.replaceChildren(
    ...entries.map((entry) => {
      const row = document.createElement("tr")
      const name = new URL(entry.name).pathname.split("/").pop() || "(this page)"
      for (const [text, align] of [
        [name, "mono"],
        [kb(entry.transferSize), "num"],
        [String(Math.round(entry.duration)), "num muted"],
      ]) {
        const cell = document.createElement("td")
        cell.className = align
        cell.textContent = text
        row.append(cell)
      }
      return row
    }),
  )
}

if (document.readyState === "complete") render()
else window.addEventListener("load", () => setTimeout(render, 50), { once: true })
