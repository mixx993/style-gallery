export type Category = {
  id: string
  desc: string
}

export type ModelInfo = {
  id: string
  count: number
}

export type StyleItem = {
  id: string
  source: string
  name: string
  category: string
  tags: string[]
  suitable?: string
  input?: string
  prompt_zh: string
  prompt_en: string
  has_image: boolean
  image: string
  url?: string | null
  models?: string[]
  model_note?: string
  model_confidence?: string
}

export type StylesData = {
  title: string
  subtitle: string
  principle?: string
  usage?: string[]
  categories: Category[]
  models?: ModelInfo[]
  styles: StyleItem[]
}
