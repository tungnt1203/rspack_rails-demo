// A second entry point: every file in app/javascript/entrypoints/ becomes its
// own bundle (admin.js), loaded only by the admin layout.
import "../application.css"
import "../controllers/autoload"

document.documentElement.dataset.area = "admin"
console.log("[demo] admin.ts loaded")
