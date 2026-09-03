export type Category = {
  id: string
  desc: string
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
}

export type StylesData = {
  title: string
  subtitle: string
  principle?: string
  usage?: string[]
  categories: Category[]
  styles: StyleItem[]
}
