// Only downloaded when lazy_controller asks for it.
export function sparkline(points: number[], width = 320, height = 80): string {
  const max = Math.max(...points)
  const step = width / (points.length - 1)
  const coords = points.map((p, i) => `${(i * step).toFixed(1)},${(height - (p / max) * (height - 8)).toFixed(1)}`)
  return `<svg viewBox="0 0 ${width} ${height}" class="w-full h-20" role="img" aria-label="Random sparkline">
    <polyline points="${coords.join(" ")}" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linejoin="round"/>
  </svg>`
}
