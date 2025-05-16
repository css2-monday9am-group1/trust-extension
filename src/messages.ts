export function isMessage(data: unknown): data is Message {
  return Boolean(typeof data === 'object' && data && 'type' in data)
}

export type AutoResolveError = 'unexpected' | 'turn' | 'empty'

export type Message =
  | {
      type: 'auto-resolve-complete'
      success: true
      prompt: string
      response: string
    }
  | {
      type: 'auto-resolve-complete'
      success: false
      error: AutoResolveError
    }
