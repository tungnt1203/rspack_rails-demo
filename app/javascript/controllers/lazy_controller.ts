import { Controller } from "@hotwired/stimulus"

// import() splits ../lib/primes into a separate chunk. Under `rspack serve`
// it is also compiled lazily, the first time the button is clicked.
export default class extends Controller<HTMLElement> {
  static targets = ["output"]

  declare readonly outputTarget: HTMLElement

  async load(): Promise<void> {
    this.outputTarget.textContent = "Loading…"
    const { primesBelow } = await import(/* webpackChunkName: "primes" */ "../lib/primes")
    const primes = primesBelow(100_000)
    this.outputTarget.textContent = `${primes.length} primes below 100,000; the largest is ${primes.at(-1)}.`
  }
}
