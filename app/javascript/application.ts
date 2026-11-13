// Main entry point, built to app/assets/builds/application.js.
// It is a .ts file: rspack_rails picks up application.{js,ts,jsx,tsx}.
import "./application.css"
import "./controllers/autoload"

import { formatTime } from "@/lib/format" // "@/*" is a tsconfig.json paths alias

console.log(`[demo] application.ts loaded at ${formatTime(new Date())}`)
