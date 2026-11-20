import { Controller } from "@hotwired/stimulus"
import { createConsumer, type Subscription } from "@rails/actioncable"

type Metrics = { at: string; rss_mb: number; threads: number; connections: number; notes: number }

let consumer: ReturnType<typeof createConsumer> | undefined

// Subscribes to MetricsChannel (app/channels/metrics_channel.rb), which
// transmits once a second, and plots the Rails process's memory.
export default class extends Controller<HTMLElement> {
  static targets = ["status", "at", "rss", "threads", "connections", "notes", "line"]
  declare readonly statusTarget: HTMLElement
  declare readonly atTarget: HTMLElement
  declare readonly rssTarget: HTMLElement
  declare readonly threadsTarget: HTMLElement
  declare readonly connectionsTarget: HTMLElement
  declare readonly notesTarget: HTMLElement
  declare readonly lineTarget: SVGPolylineElement

  private subscription?: Subscription
  private history: number[] = []

  connect(): void {
    consumer ??= createConsumer()
    this.subscription = consumer.subscriptions.create("MetricsChannel", {
      connected: () => this.setStatus("connected", "is-on"),
      disconnected: () => this.setStatus("disconnected", ""),
      received: (data: Metrics) => this.update(data),
    })
  }

  disconnect(): void {
    this.subscription?.unsubscribe()
  }

  private setStatus(text: string, color: string): void {
    this.statusTarget.innerHTML = `<span class="dot ${color}"></span> ${text}`
  }

  private update(data: Metrics): void {
    this.atTarget.textContent = data.at
    this.rssTarget.textContent = `${data.rss_mb} MB`
    this.threadsTarget.textContent = String(data.threads)
    this.connectionsTarget.textContent = String(data.connections)
    this.notesTarget.textContent = String(data.notes)

    this.history = [...this.history, data.rss_mb].slice(-60)
    const min = Math.min(...this.history) - 1
    const max = Math.max(...this.history) + 1
    const points = this.history.map((value, i) => `${(i / 59) * 100},${30 - ((value - min) / (max - min)) * 28 - 1}`)
    this.lineTarget.setAttribute("points", points.join(" "))
  }
}
