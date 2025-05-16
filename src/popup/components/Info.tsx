import { useEffect, useRef, useState } from 'react'
import { AutoResolvableHost, extractAutoResolvableHostFromURL, Hosts } from '../../hosts.js'
import './info.css'

interface InfoProps {
  setTabId: (tabId: number | null) => void
  customQuery: { prompt: string; response: string } | null
  setCustomQuery: (query: { prompt: string; response: string } | null) => void
}

export default function Info({ setTabId, customQuery, setCustomQuery }: InfoProps) {
  const [loading, setLoading] = useState(true)
  const [currentHost, setCurrentHost] = useState<AutoResolvableHost | null>(null)

  const innerCustomQuery = customQuery || { prompt: '', response: '' }

  const resolving = useRef(false)
  useEffect(() => {
    if (resolving.current) return
    resolving.current = true

    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(([tab]) => {
      setLoading(false)
      if (!tab || !tab.id || !tab.url) return setTabId(null)
      if (tab.id === chrome.tabs.TAB_ID_NONE) return setTabId(null)
      const host = extractAutoResolvableHostFromURL(tab.url)
      if (host === null) return setTabId(null)

      setTabId(tab.id)
      setCurrentHost(host)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <p>loading...</p>

  return (
    <>
      {currentHost !== null ? (
        <>
          <div className='host' style={{ opacity: customQuery ? 0.3 : 1 }}>
            <img src={`/icons/${Hosts[currentHost].icon}`} alt={`${Hosts[currentHost].name} icon`} />
            <div>
              <h2>{Hosts[currentHost].name}</h2>
              <p>Click 'Analyse Text' to automatically analyse your most recent question on this page.</p>
            </div>
          </div>

          <div className='otherhosts'>
            <p>we also support:</p>
            <div>
              {Object.entries(Hosts)
                .filter(([host]) => Number(host) !== currentHost)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .map(([_, value]) => (
                  <img
                    key={value.name}
                    src={`/icons/${value.icon}`}
                    alt={`${value.name} icon`}
                    data-tooltip-id='tooltip'
                    data-tooltip-content={value.name}
                  />
                ))}
            </div>
          </div>
        </>
      ) : (
        <p className='none'>
          <em>
            We don't currently support automatically analysing AI conversations on this site. Please use the manual
            entry below.
          </em>
        </p>
      )}

      <div className='sep'>
        <p>{currentHost !== null ? 'or paste your conversation here' : 'paste your conversation'}</p>
      </div>

      <div className='inputs'>
        <textarea
          placeholder='Your question/prompt'
          value={innerCustomQuery.prompt}
          onChange={(e) =>
            setCustomQuery(
              !e.target.value && !innerCustomQuery.response
                ? null
                : { prompt: e.target.value, response: innerCustomQuery.response },
            )
          }
        />
        <textarea
          placeholder="The AI's response"
          value={innerCustomQuery.response}
          onChange={(e) =>
            setCustomQuery(
              !innerCustomQuery.prompt && !e.target.value
                ? null
                : { prompt: innerCustomQuery.prompt, response: e.target.value },
            )
          }
        />
        <p className='hint'>
          And click 'Analyse Text', or <span onClick={() => setCustomQuery(null)}>clear your input</span>.
        </p>
      </div>
    </>
  )
}
