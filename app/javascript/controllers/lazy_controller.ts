import { Controller } from "@hotwired/stimulus"

// Loads lazy/sparkline.ts only when the button is pressed: rspack puts it in
// its own chunk (sparkline-<hash>.digested.js), fetched from /assets.
export default class extends Controller<HTMLElement> {
  static targets = ["output", "status"]
  declare readonly outputTarget: HTMLElement
  declare readonly statusTarget: HTMLElement

  async load(): Promise<void> {
    const started = performance.now()
    const { sparkline } = await import(/* webpackChunkName: "sparkline" */ "../lazy/sparkline")
    const points = Array.from({ length: 24 }, () => Math.round(20 + Math.random() * 60))
    this.outputTarget.innerHTML = sparkline(points)
    const chunk = performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .find((name) => name.includes("sparkline"))
    this.statusTarget.textContent = chunk
      ? `Loaded ${new URL(chunk).pathname} in ${Math.round(performance.now() - started)} ms`
      : "Already loaded"
  }
}
