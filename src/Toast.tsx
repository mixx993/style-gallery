type Props = { message: string | null }

export function Toast({ message }: Props) {
  if (!message) return null
  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-[80] -translate-x-1/2">
      <div className="toast-anim rounded-full bg-ink-800 px-4 py-2 text-sm text-white shadow-soft">
        {message}
      </div>
    </div>
  )
}
