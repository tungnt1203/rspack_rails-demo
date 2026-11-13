// Loaded on demand by the lazy controller with import(). rspack puts it in
// its own chunk (primes-<hash>.digested.js), fetched only when needed.
export function primesBelow(limit: number): number[] {
  const sieve = new Array<boolean>(limit).fill(true)
  const primes: number[] = []
  for (let n = 2; n < limit; n++) {
    if (!sieve[n]) continue
    primes.push(n)
    for (let multiple = n * n; multiple < limit; multiple += n) sieve[multiple] = false
  }
  return primes
}
