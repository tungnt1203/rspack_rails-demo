import { Controller } from "@hotwired/stimulus"
import { pluralize } from "@/lib/format"

// Edit this file while `bin/dev` runs: the controller is hot-swapped and the
// count survives, because the page does not reload.
export default class extends Controller<HTMLElement> {
  static targets = ["output"]
  static values = { count: Number }

  declare readonly outputTarget: HTMLElement
  declare countValue: number

  increment(): void {
    this.countValue++
  }

  reset(): void {
    this.countValue = 0
  }

  countValueChanged(): void {
    this.outputTarget.textContent = pluralize(this.countValue, "click")
  }
}
