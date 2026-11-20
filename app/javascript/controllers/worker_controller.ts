import { Controller } from "@hotwired/stimulus"
import { histogram, type Histogram } from "../lib/histogram"

const COUNT = 30_000_000

// Filters thirty million samples into a histogram, in a Web Worker or on the
// main thread. The ticker is moved by requestAnimationFrame, so it stops
// whenever the main thread is busy.
export default class extends Controller<HTMLElement> {
  static targets = ["chart", "status", "ticker", "limit", "limitLabel"]
  declare readonly chartTarget: HTMLElement
  declare readonly statusTarget: HTMLElement
  declare readonly tickerTarget: HTMLElement
  declare readonly limitTarget: HTMLInputElement
  declare readonly limitLabelTarget: HTMLElement

  private worker?: Worker
  private frame = 0
  private busy = false

  connect(): void {
    const tick = (time: number) => {
      this.tickerTarget.style.left = `calc(${(Math.sin(time / 300) + 1) / 2} * (100% - 1.5rem))`
      this.frame = requestAnimationFrame(tick)
    }
    this.frame = requestAnimationFrame(tick)
    this.updateLabel()
  }

  disconnect(): void {
    cancelAnimationFrame(this.frame)
    this.worker?.terminate()
  }

  runInWorker(): void {
    if (this.busy) return
    this.busy = true
    this.worker ??= new Worker(new URL("../workers/histogram.worker.ts", import.meta.url), { name: "histogram" })
    this.worker.onmessage = (event: MessageEvent<Histogram>) => {
      this.busy = false
      this.draw(event.data, "Web Worker")
    }
    this.statusTarget.textContent = "Working in the worker…"
    this.worker.postMessage({ count: COUNT, limit: this.limit })
  }

  runOnMainThread(): void {
    this.statusTarget.textContent = "Working on the main thread…"
    // Let the status paint before blocking.
    setTimeout(() => {
      this.draw(histogram(COUNT, this.limit), "main thread")
    }, 30)
  }

  limitChanged(): void {
    this.updateLabel()
    this.runInWorker()
  }

  private get limit(): number {
    return Number(this.limitTarget.value)
  }

  private updateLabel(): void {
    this.limitLabelTarget.textContent = `±${this.limit.toFixed(1)}σ`
  }

  private draw({ bins, kept, total, ms }: Histogram, where: string): void {
    const max = Math.max(...bins, 1)
    const width = 100 / bins.length
    const bars = bins
      .map((count, i) => {
        const height = (count / max) * 100
        return `<rect x="${i * width + width * 0.1}" y="${100 - height}" width="${width * 0.8}" height="${height}" rx="0.4" />`
      })
      .join("")
    this.chartTarget.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="h-32 w-full fill-orange-500">${bars}</svg>`
    this.statusTarget.textContent =
      `${kept.toLocaleString()} of ${total.toLocaleString()} samples kept · ${Math.round(ms)} ms on the ${where}`
  }
}
