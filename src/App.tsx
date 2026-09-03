import { useEffect, useMemo, useState } from 'react'
import { DetailDrawer } from './DetailDrawer'
import { StyleCard } from './StyleCard'
import { Toast } from './Toast'
import type { StylesData, StyleItem } from './types'

const ALL = '全部'
const ALL_MODELS = '全部模型'

export default function App() {
  const [data, setData] = useState<StylesData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState(ALL)
  const [model, setModel] = useState(ALL_MODELS)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<StyleItem | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/styles.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`加载失败 ${r.status}`)
        return r.json()
      })
      .then((json: StylesData) => setData(json))
      .catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 1800)
    return () => window.clearTimeout(t)
  }, [toast])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const counts = useMemo(() => {
    const map: Record<string, number> = { [ALL]: data?.styles.length ?? 0 }
    for (const c of data?.categories ?? []) map[c.id] = 0
    for (const s of data?.styles ?? []) {
      map[s.category] = (map[s.category] ?? 0) + 1
    }
    return map
  }, [data])

  const modelCounts = useMemo(() => {
    const map: Record<string, number> = { [ALL_MODELS]: data?.styles.length ?? 0 }
    for (const s of data?.styles ?? []) {
      const ms = s.models?.length ? s.models : ['未注明']
      for (const m of ms) map[m] = (map[m] ?? 0) + 1
    }
    return map
  }, [data])

  const modelNav = useMemo(() => {
    if (data?.models?.length) return data.models.map((m) => m.id)
    return Object.keys(modelCounts).filter((k) => k !== ALL_MODELS)
  }, [data, modelCounts])

  const filtered = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    return data.styles.filter((s) => {
      if (category !== ALL && s.category !== category) return false
      const ms = s.models?.length ? s.models : ['未注明']
      if (model !== ALL_MODELS && !ms.includes(model)) return false
      if (!q) return true
      const hay = [
        s.name,
        s.category,
        s.suitable,
        s.prompt_zh,
        ...(s.tags ?? []),
        ...ms,
      ]
        .filter(Boolean)
        .join('\n')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [data, category, model, query])

  const withImages = useMemo(
    () => (data?.styles.filter((s) => s.has_image).length ?? 0),
    [data],
  )

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      setToast(label)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setToast(label)
    }
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-ink-500">
        {error}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-ink-400">
        加载中…
      </div>
    )
  }

  const navItems = [
    { id: ALL, desc: '全部风格' },
    ...data.categories,
  ]

  const titleBits = [
    category === ALL ? '全部风格' : category,
    model !== ALL_MODELS ? model : null,
  ].filter(Boolean)

  return (
    <div className="min-h-full">
      <div className="mx-auto flex min-h-full max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-ink-100 bg-ink-50/80 px-4 py-8 md:flex lg:w-64 lg:px-5">
          <div className="mb-8 px-2">
            <h1 className="text-lg font-semibold tracking-tight text-ink-900">
              {data.title}
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-400">
              {data.subtitle}
            </p>
            <p className="mt-3 text-[11px] text-ink-300">
              {data.styles.length} 风格 · {withImages} 有图
            </p>
          </div>

          <nav className="scroll-thin flex-1 space-y-5 overflow-y-auto pr-1">
            <div>
              <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wide text-ink-300">
                风格分类
              </p>
              <div className="space-y-0.5">
                {navItems.map((c) => {
                  const active = category === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        active
                          ? 'bg-white text-ink-900 shadow-sm ring-1 ring-ink-100'
                          : 'text-ink-500 hover:bg-white/70 hover:text-ink-800'
                      }`}
                    >
                      <span className="truncate">{c.id}</span>
                      <span
                        className={`ml-2 tabular-nums text-xs ${
                          active ? 'text-ink-500' : 'text-ink-300'
                        }`}
                      >
                        {counts[c.id] ?? 0}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wide text-ink-300">
                按模型
              </p>
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setModel(ALL_MODELS)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    model === ALL_MODELS
                      ? 'bg-white text-ink-900 shadow-sm ring-1 ring-ink-100'
                      : 'text-ink-500 hover:bg-white/70 hover:text-ink-800'
                  }`}
                >
                  <span>全部模型</span>
                  <span className="ml-2 tabular-nums text-xs text-ink-300">
                    {modelCounts[ALL_MODELS] ?? 0}
                  </span>
                </button>
                {modelNav.map((m) => {
                  const active = model === m
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModel(m)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        active
                          ? 'bg-white text-ink-900 shadow-sm ring-1 ring-ink-100'
                          : 'text-ink-500 hover:bg-white/70 hover:text-ink-800'
                      }`}
                    >
                      <span className="truncate">{m}</span>
                      <span
                        className={`ml-2 tabular-nums text-xs ${
                          active ? 'text-ink-500' : 'text-ink-300'
                        }`}
                      >
                        {modelCounts[m] ?? 0}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>

          {data.usage && data.usage.length > 0 && (
            <div className="mt-6 border-t border-ink-100 px-2 pt-4">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-300">
                用法
              </p>
              <ul className="space-y-1.5 text-[11px] leading-relaxed text-ink-400">
                {data.usage.map((u) => (
                  <li key={u}>· {u}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-ink-400 md:hidden">{data.title}</p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                {titleBits.join(' · ')}
              </h2>
              <p className="mt-1 text-sm text-ink-400">
                {filtered.length} 个结果
                {query ? ` · 搜索「${query}」` : ''}
              </p>
            </div>
            <div className="w-full sm:max-w-xs">
              <label className="sr-only" htmlFor="search">
                搜索
              </label>
              <input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索名称 / 模型 / 提示词…"
                className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 outline-none placeholder:text-ink-300 focus:border-ink-400 focus:ring-2 focus:ring-ink-100"
              />
            </div>
          </header>

          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {navItems.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                  category === c.id
                    ? 'bg-ink-800 text-white'
                    : 'bg-white text-ink-500 ring-1 ring-ink-200'
                }`}
              >
                {c.id} {counts[c.id] ?? 0}
              </button>
            ))}
          </div>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 md:hidden">
            <button
              type="button"
              onClick={() => setModel(ALL_MODELS)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                model === ALL_MODELS
                  ? 'bg-sky-700 text-white'
                  : 'bg-white text-ink-500 ring-1 ring-ink-200'
              }`}
            >
              全部模型
            </button>
            {modelNav.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModel(m)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                  model === m
                    ? 'bg-sky-700 text-white'
                    : 'bg-white text-ink-500 ring-1 ring-ink-200'
                }`}
              >
                {m} {modelCounts[m] ?? 0}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-white/50 px-6 py-20 text-center text-sm text-ink-400">
              没有匹配的风格
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <StyleCard
                  key={item.id}
                  item={item}
                  onOpen={setSelected}
                  onCopy={copyText}
                />
              ))}
            </div>
          )}

          <footer className="mt-16 border-t border-ink-100 pt-6 text-center text-xs text-ink-300">
            <a
              className="underline-offset-2 hover:underline"
              href="https://mixx993.github.io/style-gallery/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub Pages
            </a>
            {' · '}提示词整段复制使用
          </footer>
        </main>
      </div>

      <DetailDrawer
        item={selected}
        onClose={() => setSelected(null)}
        onCopy={copyText}
      />
      <Toast message={toast} />
    </div>
  )
}
