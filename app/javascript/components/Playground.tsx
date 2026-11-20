import { useEffect, useState } from "react"
import { ListTodo, Plus, Trash2 } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import boltUrl from "../images/bolt.svg"

type Props = { owner: string }
type Item = { text: string; addedAt: Date }

// Edit this file under bin/dev: Fast Refresh swaps it in and keeps the list.
// lucide-react has 1,500+ icons; only the three imported here end up in the bundle.
export default function Playground({ owner }: Props) {
  const [items, setItems] = useState<Item[]>([
    { text: "Try Fast Refresh", addedAt: new Date(Date.now() - 5 * 60_000) },
    { text: "Load the lazy chunk", addedAt: new Date(Date.now() - 90_000) },
  ])
  const [draft, setDraft] = useState("")
  const [, setNow] = useState(Date.now())

  // Re-render every 15 s so "x phút trước" stays current.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15_000)
    return () => clearInterval(timer)
  }, [])

  const add = () => {
    if (!draft.trim()) return
    setItems([...items, { text: draft.trim(), addedAt: new Date() }])
    setDraft("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img src={boltUrl} alt="" className="h-10 w-10" />
        <p className="text-sm text-slate-600">
          {owner} list, rendered by React. Icons from lucide-react, dates from date-fns (vi locale).
        </p>
      </div>
      <p className="flex items-center gap-2 text-xs text-slate-500">
        <ListTodo className="h-4 w-4" />
        {format(new Date(), "EEEE, d MMMM yyyy", { locale: vi })}
      </p>
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
        <button className="flex items-center gap-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>
      <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        {items.map((item, index) => (
          <li key={`${item.text}-${index}`} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
            <span>
              {item.text}
              <span className="ml-2 text-xs text-slate-400">
                {formatDistanceToNow(item.addedAt, { addSuffix: true, locale: vi })}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              className="text-slate-400 hover:text-red-500"
              aria-label={`Remove ${item.text}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-500">{items.length} items</p>
    </div>
  )
}
