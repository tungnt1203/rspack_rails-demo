import { Controller } from "@hotwired/stimulus"
import heroUrl from "../images/hero.jpg"
import boltUrl from "../images/bolt.svg"

// What an image import turns into: a file URL above 8 KB, a data: URI below.
export default class extends Controller<HTMLElement> {
  static targets = ["hero", "heroUrl", "bolt", "boltUrl"]
  declare readonly heroTarget: HTMLImageElement
  declare readonly heroUrlTarget: HTMLElement
  declare readonly boltTarget: HTMLImageElement
  declare readonly boltUrlTarget: HTMLElement

  connect(): void {
    this.heroTarget.src = heroUrl
    this.heroUrlTarget.textContent = new URL(heroUrl, location.href).pathname
    this.boltTarget.src = boltUrl
    this.boltUrlTarget.textContent = `${boltUrl.slice(0, 48)}… (${boltUrl.length} chars)`
  }
}
