import { Controller } from "@hotwired/stimulus"
import type { Map as LeafletMap } from "leaflet"

// Leaflet and its CSS (with the marker images it references) load only on
// pages that have a map: one lazy chunk for the JS, one for the CSS.
export default class extends Controller<HTMLElement> {
  static values = { places: Array }
  declare readonly placesValue: [string, number, number][]
  private map?: LeafletMap

  async connect(): Promise<void> {
    const [{ default: L }, iconUrl, iconRetinaUrl, shadowUrl] = await Promise.all([
      import(/* webpackChunkName: "leaflet" */ "leaflet"),
      // Leaflet guesses its marker image URLs from its CSS, which a bundler
      // rewrites (here into data: URIs). Give it the bundled images instead.
      import("leaflet/dist/images/marker-icon.png").then((m) => m.default),
      import("leaflet/dist/images/marker-icon-2x.png").then((m) => m.default),
      import("leaflet/dist/images/marker-shadow.png").then((m) => m.default),
      import(/* webpackChunkName: "leaflet" */ "leaflet/dist/leaflet.css"),
    ])
    if (!this.element.isConnected) return

    // A string imagePath stops Leaflet from guessing; the URLs are complete.
    L.Icon.Default.imagePath = ""
    L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl })

    this.map = L.map(this.element, { scrollWheelZoom: false })
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map)
    const markers = this.placesValue.map(([name, lat, lng]) => L.marker([lat, lng]).bindPopup(name).addTo(this.map!))
    this.map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [30, 30] })
  }

  disconnect(): void {
    this.map?.remove()
  }
}
