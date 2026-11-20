// Runs off the main thread. Rspack bundles it as its own chunk because of
// `new Worker(new URL("../workers/histogram.worker.ts", import.meta.url))`.
import { histogram } from "../lib/histogram"

type Request = { count: number; limit: number }

self.addEventListener("message", (event: MessageEvent<Request>) => {
  const { count, limit } = event.data
  ;(self as unknown as Worker).postMessage(histogram(count, limit))
})
