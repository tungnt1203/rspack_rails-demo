// Shared by the worker (workers/histogram.worker.ts) and the main-thread
// comparison in controllers/worker_controller.ts.
export type Histogram = { bins: number[]; kept: number; total: number; ms: number }

// Draws `count` normally distributed samples (Box-Muller, mean 0, standard
// deviation 1), keeps those within ±limit and counts them into bins. Samples
// are not stored, so tens of millions take time but no memory.
export function histogram(count: number, limit: number, binCount = 40): Histogram {
  const started = performance.now()
  const bins = new Array<number>(binCount).fill(0)
  const width = (2 * limit) / binCount
  let kept = 0
  const add = (value: number) => {
    if (value < -limit || value >= limit) return
    bins[Math.floor((value + limit) / width)]++
    kept++
  }
  for (let i = 0; i < count; i += 2) {
    const r = Math.sqrt(-2 * Math.log(1 - Math.random()))
    const theta = 2 * Math.PI * Math.random()
    add(r * Math.cos(theta))
    add(r * Math.sin(theta))
  }
  return { bins, kept, total: count, ms: performance.now() - started }
}
