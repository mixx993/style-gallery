import type { StyleItem } from './types'

function assetUrl(path: string) {
  const clean = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${clean}`
}

type Props = {
  item: StyleItem | null
  onClose: () => void
  onCopy: (text: string, label: string) => void
}

export function DetailDrawer({ item, onClose, onCopy }: Props) {
  if (!item) return null

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        aria-label="关闭"
        className="absolute inset-0 bg-ink-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
          <div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-ink-50 px-1.5 py-0.5 text-[11px] text-ink-500">
                {item.category}
              </span>
              {!item.has_image && (
                <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-700">
                  待补图
                </span>
              )}
            </div>
            <h2 className="text-lg font-medium leading-snug text-ink-900">
              {item.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-ink-200 px-3 py-1 text-sm text-ink-500 hover:bg-ink-50"
          >
            关闭
          </button>
        </div>

        <div className="scroll-thin flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-5 overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
            {item.has_image ? (
              <img
                src={assetUrl(item.image)}
                alt={item.name}
                className="max-h-72 w-full object-contain bg-ink-50"
              />
            ) : (
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-ink-100 via-stone-100 to-amber-50">
                <span className="rounded-full border border-ink-200 bg-white/70 px-3 py-1 text-sm text-ink-500">
                  待补图
                </span>
              </div>
            )}
          </div>

          {(item.suitable || item.input) && (
            <div className="mb-5 space-y-2 rounded-xl bg-ink-50 px-4 py-3 text-sm leading-relaxed text-ink-600">
              {item.suitable && (
                <p>
                  <span className="text-ink-400">适用 · </span>
                  {item.suitable}
                </p>
              )}
              {item.input && (
                <p>
                  <span className="text-ink-400">输入 · </span>
                  {item.input}
                </p>
              )}
            </div>
          )}

          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="mb-5 inline-flex text-sm text-ink-500 underline-offset-2 hover:text-ink-800 hover:underline"
            >
              查看原帖
            </a>
          ) : null}

          <section className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-ink-700">中文提示词</h3>
              <button
                type="button"
                className="rounded-lg bg-ink-800 px-3 py-1.5 text-xs text-white hover:bg-ink-700"
                onClick={() => onCopy(item.prompt_zh, '已复制中文提示词')}
              >
                复制中文
              </button>
            </div>
            <pre className="whitespace-pre-wrap rounded-xl border border-ink-100 bg-ink-50/60 p-4 text-[13px] leading-relaxed text-ink-700">
              {item.prompt_zh}
            </pre>
          </section>

          <section className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-ink-700">English Prompt</h3>
              <button
                type="button"
                className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-700 hover:bg-ink-50"
                onClick={() => onCopy(item.prompt_en, '已复制英文提示词')}
              >
                Copy EN
              </button>
            </div>
            <pre className="whitespace-pre-wrap rounded-xl border border-ink-100 bg-white p-4 text-[13px] leading-relaxed text-ink-600">
              {item.prompt_en}
            </pre>
          </section>
        </div>
      </aside>
    </div>
  )
}
