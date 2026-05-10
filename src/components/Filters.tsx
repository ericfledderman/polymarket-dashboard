import type { Category, SortKey } from '../types'

const CATEGORIES: Category[] = ['All', 'Politics', 'Crypto', 'Sports', 'Science', 'Tech', 'Other']

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'volume', label: 'Volume' },
  { key: 'liquidity', label: 'Liquidity' },
  { key: 'endDate', label: 'Ending Soon' },
  { key: 'probability', label: 'Certainty' },
]

interface Props {
  category: Category
  sort: SortKey
  onCategory: (c: Category) => void
  onSort: (s: SortKey) => void
  total: number
}

export function Filters({ category, sort, onCategory, onSort, total }: Props) {
  return (
    <div className="mb-6 flex min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="mr-1 w-full shrink-0 font-mono text-xs font-medium tracking-wide text-[var(--muted)] sm:w-auto">
          FILTER
        </span>
        {CATEGORIES.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => onCategory(c)}
            className={`min-h-9 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors active:scale-[0.98] ${
              category === c
                ? 'border border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border border-[var(--border)] bg-[var(--surface)] font-normal text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
        <span className="w-full shrink-0 font-mono text-xs font-medium tracking-wide text-[var(--muted)] sm:w-auto">
          SORT
        </span>
        <select
          value={sort}
          onChange={e => onSort(e.target.value as SortKey)}
          className="min-h-9 min-w-0 flex-1 cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus-visible:border-[var(--accent)] sm:flex-none sm:min-w-[10rem]"
        >
          {SORTS.map(s => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="font-mono text-xs font-medium text-[var(--muted)]">{total} markets</span>
      </div>
    </div>
  )
}
