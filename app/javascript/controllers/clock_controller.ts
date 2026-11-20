import { Controller } from "@hotwired/stimulus"

// A Stimulus controller in TypeScript, registered by controllers/autoload.js.
export default class extends Controller<HTMLElement> {
  private timer?: number

  connect(): void {
    this.tick()
    this.timer = window.setInterval(() => this.tick(), 1000)
  }

  disconnect(): void {
    window.clearInterval(this.timer)
  }

  private tick(): void {
    this.element.textContent = new Date().toLocaleTimeString()
  }
}
