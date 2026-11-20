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
    this.chart = new Chart(this.canvasTarget, {
      type: "bar",
      data: {
        labels: ["webpack", "esbuild", "Vite", "Rspack"],
        datasets: [{ label: "Cold build (s), made-up numbers", data: [21.4, 2.1, 6.3, 1.8], backgroundColor: "#f97316" }],
      },
      options: { plugins: { legend: { display: false } }, animation: { duration: 400 } },
    })
    this.buttonTarget.textContent = "Loaded"
  }

  disconnect(): void {
    this.chart?.destroy()
  }
}
