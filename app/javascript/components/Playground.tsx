import { useState } from "react"
import boltUrl from "../images/bolt.svg"

type Props = { owner: string }

// Edit this file under bin/dev: Fast Refresh swaps it in and keeps the list.
export default function Playground({ owner }: Props) {
  const [items, setItems] = useState<string[]>(["Try Fast Refresh", "Load the lazy chunk"])
  const [draft, setDraft] = useState("")

  const add = () => {
    if (!draft.trim()) return
    setItems([...items, draft.trim()])
    setDraft("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img src={boltUrl} alt="" className="h-10 w-10" />
        <p className="text-sm text-slate-600">
          {owner}'s list, rendered by React. The icon is an SVG imported from JavaScript; under 8 KB, so
          rspack inlines it as a data URI.
        </p>
      </div>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          add()
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add an item"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
        <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
          Add
        </button>
      </form>
      <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-center justify-between px-3 py-2 text-sm">
            <span>{item}</span>
            <button
              type="button"
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              className="text-slate-400 hover:text-red-500"
              aria-label={`Remove ${item}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-500">{items.length} items</p>
    </div>
  )
}
