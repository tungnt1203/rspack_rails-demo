import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

// Drag to reorder; the order is written back into the output target.
export default class extends Controller<HTMLElement> {
  static targets = ["list", "output"]
  declare readonly listTarget: HTMLElement
  declare readonly outputTarget: HTMLElement
  private sortable?: Sortable

  connect(): void {
    this.sortable = Sortable.create(this.listTarget, {
      animation: 150,
      ghostClass: "opacity-40",
      onSort: () => this.report(),
    })
    this.report()
  }

  disconnect(): void {
    this.sortable?.destroy()
  }

  private report(): void {
    const names = [...this.listTarget.children].map((item) => (item as HTMLElement).dataset.name)
    this.outputTarget.textContent = names.join(" › ")
  }
}
