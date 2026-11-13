import { Controller } from "@hotwired/stimulus"

export default class extends Controller<HTMLElement> {
  static targets = ["source", "button"]

  declare readonly sourceTarget: HTMLElement
  declare readonly buttonTarget: HTMLButtonElement

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.sourceTarget.textContent?.trim() ?? "")
    const label = this.buttonTarget.textContent
    this.buttonTarget.textContent = "Copied"
    setTimeout(() => (this.buttonTarget.textContent = label), 1500)
  }
}
