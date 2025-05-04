import { useEffect, useState } from 'react'
import { isMessage } from '../messages'

export default function Popup() {
  const [count, setCount] = useState(0)
  const [analyseAnimating, setAnalyseAnimating] = useState(false)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(message => {
      if (!isMessage(message)) return
      if (message.type === 'trigger-manual') {
        setCount(1234)
      }
    })
  }, [])

  return (
    <div className='top'>
      <button onClick={() => setAnalyseAnimating(true)} data-animating={analyseAnimating}>Analyse Text</button>
    </div>
  )
}
