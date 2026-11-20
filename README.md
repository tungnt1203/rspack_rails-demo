# rspack_rails demo

A Rails 8.1 app built with [rspack_rails](https://github.com/tungnt1203/rspack_rails): React and Stimulus in TypeScript, Tailwind CSS v4, CSS modules in Sass, lazy chunks, a Web Worker, Turbo Streams over Action Cable and a second entry point, all with hot module replacement under `bin/dev`.

**Live:** https://52-65-113-251.sslip.io (deployed with Kamal to a single EC2 instance)

## Run it

You need Ruby 3.3+ and Node.js 20.19+ or 22.12+.

```bash
git clone https://github.com/tungnt1203/rspack_rails-demo.git
cd rspack_rails-demo
bin/setup --skip-server
bin/dev
```

Open http://localhost:3000.

## Try hot reloading

With `bin/dev` running and the page open:

1. Add a few items to the React list, then edit `app/javascript/components/Playground.tsx`. Fast Refresh swaps the component in and the list stays.
2. Pick a swatch under **CSS Modules and Sass**, then change `$base` in `app/javascript/components/ThemeSwatches.module.scss`. The colors change without a reload, and the selection stays.
3. Edit `app/javascript/controllers/clock_controller.ts`. Stimulus swaps the controller in place.
4. Add a Tailwind class to `app/views/pages/home.html.erb`. Views are rendered by Rails, so the page reloads by itself, with the new class already built.

## What is on the page

| Section | Files |
|---|---|
| React component, lucide-react icons, date-fns | [`components/Playground.tsx`](app/javascript/components/Playground.tsx) |
| Stimulus controller in TypeScript, registered with no manifest | [`controllers/clock_controller.ts`](app/javascript/controllers/clock_controller.ts) |
| Lazy chunks: a sparkline, Chart.js (about 200 KB), Leaflet with its CSS and marker images | [`lazy_controller.ts`](app/javascript/controllers/lazy_controller.ts), [`chart_controller.ts`](app/javascript/controllers/chart_controller.ts), [`map_controller.ts`](app/javascript/controllers/map_controller.ts) |
| SortableJS | [`sortable_controller.ts`](app/javascript/controllers/sortable_controller.ts) |
| CSS modules in Sass and plain CSS | [`ThemeSwatches.tsx`](app/javascript/components/ThemeSwatches.tsx), [`ThemeSwatches.module.scss`](app/javascript/components/ThemeSwatches.module.scss), [`Badge.module.css`](app/javascript/components/Badge.module.css) |
| Images and fonts from TypeScript and CSS: a JPEG emitted with a hash, SVGs inlined, Inter and JetBrains Mono from Fontsource | [`assets_controller.ts`](app/javascript/controllers/assets_controller.ts), [`application.css`](app/javascript/application.css) |
| Notes posted with Turbo Streams and broadcast to every open tab | [`notes_controller.rb`](app/controllers/notes_controller.rb), [`note.rb`](app/models/note.rb) |
| Server numbers pushed every second by a custom Action Cable channel | [`metrics_channel.rb`](app/channels/metrics_channel.rb), [`live_controller.ts`](app/javascript/controllers/live_controller.ts) |
| A lazy Turbo Frame | [`pages/stats.html.erb`](app/views/pages/stats.html.erb) |
| Thirty million samples in a Web Worker, against the same work on the main thread | [`worker_controller.ts`](app/javascript/controllers/worker_controller.ts), [`workers/histogram.worker.ts`](app/javascript/workers/histogram.worker.ts) |
| `/admin`, a page with its own bundle (about 1 KB of JavaScript) | [`entrypoints/admin.ts`](app/javascript/entrypoints/admin.ts), [`entrypoints/admin.css`](app/javascript/entrypoints/admin.css), [`layouts/admin.html.erb`](app/views/layouts/admin.html.erb) |

Everything under `app/javascript` is bundled by Rspack into `app/assets/builds`, and Propshaft serves it. [`rspack.config.mjs`](rspack.config.mjs) is untouched: the defaults come from [`config/rspack/rails.mjs`](config/rspack/rails.mjs), which the gem keeps up to date.

## Deploy

```bash
bin/kamal deploy
```

[`config/deploy.yml`](config/deploy.yml) points at one server, with HTTPS from Let's Encrypt through an [sslip.io](https://sslip.io) host name. Change `servers`, `proxy.host` and `ssh` for your own. The Dockerfile installs Node.js only in the build stage; the final image has no `node_modules`.
