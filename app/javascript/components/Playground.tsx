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
        <p className="text-sm text-ink-2">
          {owner} list, rendered by React. Icons from lucide-react, dates from date-fns (vi locale).
        </p>
      </div>
      <p className="flex items-center gap-2 text-sm text-muted">
        <ListTodo className="h-4 w-4" />
        {format(new Date(), "EEEE, d MMMM yyyy", { locale: vi })}
      </p>
      <form
        className="note-form"
        onSubmit={(event) => {
          event.preventDefault()
          add()
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add an item"
          className="input flex-1"
          aria-label="New item"
        />
        <button className="key key--primary">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>
      <ul className="notes-list">
        {items.map((item, index) => (
          <li key={`${item.text}-${index}`} className="note">
            <span className="note__body">
              {item.text}
              <span className="ml-2 text-sm text-muted">
                {formatDistanceToNow(item.addedAt, { addSuffix: true, locale: vi })}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              className="key--quiet"
              aria-label={`Remove ${item.text}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">{items.length} items</p>
    </div>
  )
}
