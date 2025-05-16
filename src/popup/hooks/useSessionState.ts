import { useEffect, useState } from 'react'

export function useSessionState<T>(key: string, initialValue: T) {
  const [state, innerSetState] = useState(initialValue)

  useEffect(() => {
    chrome.storage.session.get(key, (items) => {
      if (key in items && items[key]) {
        innerSetState(items[key])
      }
    })
  }, [key])

  return [
    state,
    (newState: T) => {
      innerSetState(newState)
      chrome.storage.session.set({ [key]: newState })
    },
  ] as const
}
