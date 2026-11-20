import { Controller } from "@hotwired/stimulus"
import type { Chart as ChartType } from "chart.js"

// Chart.js (about 200 KB) is fetched on the first click, not with the page.
export default class extends Controller<HTMLElement> {
  static targets = ["canvas", "button"]
  declare readonly canvasTarget: HTMLCanvasElement
  declare readonly buttonTarget: HTMLButtonElement
  private chart?: ChartType

  async show(): Promise<void> {
    this.buttonTarget.disabled = true
    const { default: Chart } = await import(/* webpackChunkName: "chartjs" */ "chart.js/auto")
    this.chart?.destroy()
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim()
    this.chart = new Chart(this.canvasTarget, {
      type: "bar",
      data: {
        labels: ["webpack", "esbuild", "Rspack"],
        // Production build of 1,000 components, from benchmark/ in the rspack_rails repo (Apple M1, Node 26.5.1).
        datasets: [{ label: "Production build (s)", data: [4.1, 0.51, 0.73], backgroundColor: accent }],
      },
      options: { plugins: { legend: { display: false } }, animation: { duration: 400 } },
    })
    this.buttonTarget.textContent = "Loaded"
  }

  disconnect(): void {
    this.chart?.destroy()
  }
}
