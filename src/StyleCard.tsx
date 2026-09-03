import type { StyleItem } from './types'

function assetUrl(path: string) {
  const clean = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${clean}`
}

type Props = {
  item: StyleItem
  onOpen: (item: StyleItem) => void
  onCopy: (text: string, label: string) => void
}

export function StyleCard({ item, onOpen, onCopy }: Props) {
  return (
    <article
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ink-200/80 bg-white transition hover:border-ink-300 hover:shadow-soft"
      onClick={() => onOpen(item)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        {item.has_image ? (
          <img
            src={assetUrl(item.image)}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            onError={(e) => {
              const el = e.currentTarget
              el.style.display = 'none'
              const ph = el.nextElementSibling as HTMLElement | null
              if (ph) ph.classList.remove('hidden')
            }}
          />
        ) : null}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-ink-100 via-stone-100 to-amber-50 ${
            item.has_image ? 'hidden' : ''
          }`}
        >
          <span className="rounded-full border border-ink-200 bg-white/70 px-2.5 py-0.5 text-xs text-ink-500 backdrop-blur">
            待补图
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-ink-50 px-1.5 py-0.5 text-[11px] text-ink-500">
              {item.category}
            </span>
            {(item.models ?? ['未注明']).map((m) => (
              <span
                key={m}
                className={`rounded-md px-1.5 py-0.5 text-[11px] ${
                  m === '未注明'
                    ? 'bg-stone-100 text-stone-500'
                    : 'bg-sky-50 text-sky-700'
                }`}
              >
                {m}
              </span>
            ))}
            {!item.has_image && (
              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-700">
                待补图
              </span>
            )}
          </div>
          <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-ink-800">
            {item.name}
          </h3>
          {item.suitable ? (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-400">
              {item.suitable}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <button
            type="button"
            className="flex-1 rounded-lg border border-ink-200 bg-ink-50 px-2 py-1.5 text-xs text-ink-600 transition hover:bg-ink-100"
            onClick={(e) => {
              e.stopPropagation()
              onCopy(item.prompt_zh, '已复制中文提示词')
            }}
          >
            复制中文
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-xs text-ink-600 transition hover:bg-ink-50"
            onClick={(e) => {
              e.stopPropagation()
              onCopy(item.prompt_en, '已复制英文提示词')
            }}
          >
            复制英文
          </button>
        </div>
      </div>
    </article>
  )
}
