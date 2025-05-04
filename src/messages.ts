export function isMessage(data: unknown): data is Message {
  return Boolean(typeof data === 'object' && data && 'type' in data)
}

export type Message = {
  type: 'trigger-manual',
  selection: string
}
