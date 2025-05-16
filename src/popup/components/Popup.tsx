import { useCallback, useEffect, useState } from 'react'
import calculate from '../../calculate'
import Results from './Results'
import { ArrowLeft } from 'react-feather'
import Info from './Info.js'
import { AutoResolveError, isMessage } from '../../messages.js'
import { useSessionState } from '../hooks/useSessionState.js'

// const DEMO_RESULT = {"outputs":[{"version":"v0.2","output":{"category":"Informational","aspects":[{"aspect":"Accuracy","weighting":0.2656826568265683,"score":55.64764,"limitations":1},{"aspect":"Explainability","weighting":0.28413284132841327,"score":54.62785,"limitations":2},{"aspect":"Consistency","weighting":0.24723247232472323,"score":71.48314,"limitations":1},{"aspect":"Fairness","weighting":0.2029520295202952,"score":20.611899999999995,"limitations":1}],"limitations":[{"limitation":"Inaccuracy","description":"The modal's response includes data inaccuracies","occurrence":7.8,"criticality":9,"encountered":true,"penalty":0.7020000000000001},{"limitation":"Disconnect","description":"The model's response does not make sense in connection with the user prompt","occurrence":9.5,"criticality":10,"encountered":true,"penalty":0.855},{"limitation":"Under-explanation","description":"The model fails to explain how it reached its conclusion","occurrence":6.6,"criticality":5,"encountered":true,"penalty":0.594},{"limitation":"Confusion","description":"The model fails to understand the prompt due to noisy, incomplete or corrupted data","occurrence":8.1,"criticality":5,"encountered":false,"penalty":0.17100000000000004},{"limitation":"Contradiction","description":"The model's response includes contradictions","occurrence":9.9,"criticality":7,"encountered":true,"penalty":0.891},{"limitation":"Unfairness","description":"The model's response disproportionally benefits or disadvantages specific groups based on sensitive attributes","occurrence":9.9,"criticality":10,"encountered":true,"penalty":0.891}],"score":52.16235944649446},"duration":2330}],"duration":2332}

export default function Popup() {
  // const [prompt] = useState('what is the capital city of australia?')
  // const [response] = useState('the capital city of australia is sydney!')
  const [tabId, setTabId] = useState<number | null>()
  const [customQuery, setCustomQuery] = useSessionState<{ prompt: string; response: string } | null>(
    'custom_query',
    null,
  )

  const [analysing, setAnalysing] = useState(false)
  const [analyseError, setAnalyseError] = useState('')
  const [results, setResults] = useState<null | Awaited<ReturnType<typeof calculate>>>()
  const [score, setScore] = useState(0)

  const analyse = useCallback((prompt: string, response: string) => {
    setAnalysing(true)
    setAnalyseError('')
    calculate(prompt, response).then((res) => {
      setCustomQuery(null)
      setAnalysing(false)
      setResults(res)
      setScore((res.outputs?.[0]?.success && res.outputs[0].result.score) || NaN)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function onMessage(message: unknown) {
      if (!isMessage(message)) return
      if (message.type === 'auto-resolve-complete') {
        if (message.success) {
          analyse(message.prompt, message.response)
        } else {
          setAnalysing(false)
          const errors: Record<AutoResolveError, string> = {
            unexpected:
              'Sorry, an unexpected error occurred. Please try again, or if this keeps happening, contact the developer.',
            turn: `We couldn't analyse the text from this conversation. Please make sure it's your turn and the response is complete.`,
            empty: `We couldn't analyse the text from this conversation. Please make sure there is a valid prompt and response.`,
          }
          setAnalyseError(errors[message.error])
        }
      }
    }

    chrome.runtime.onMessage.addListener(onMessage)
    return () => chrome.runtime.onMessage.removeListener(onMessage)
  }, [analyse])

  function onClickAnalyse() {
    // already analysing, or already have results
    if (analysing || results) return
    // still waiting to check the current tab
    if (tabId === undefined) return

    if (customQuery) {
      if (!customQuery.prompt.trim() || !customQuery.response.trim()) return
      analyse(customQuery.prompt, customQuery.response)
    } else if (tabId) {
      setAnalysing(true)
      setAnalyseError('')
      chrome.scripting.executeScript({ files: ['content-script.js'], target: { tabId } })
    }
  }

  return (
    <>
      <div>
        <div className='top'>
          <div className='left'>
            {results && <ArrowLeft className='clickable' size={18} onClick={() => setResults(null)} />}
          </div>

          <div className='interactive'>
            <button
              className='clickable'
              onClick={onClickAnalyse}
              data-waiting={tabId === undefined}
              data-animating={analysing}
              data-result={Boolean(results)}
            >
              <h2>{results ? (isNaN(score) ? '--' : score.toFixed(1) + '%') : 'Analyse Text'}</h2>
              {results && (
                <p>
                  <strong>Trust Score</strong>
                </p>
              )}
              <span className='loader' />
            </button>
          </div>

          <div className='right'>
            {/* <Settings className='clickable' size={18} onClick={() => alert('nope')} /> */}
          </div>
        </div>

        {results ? (
          <Results data={results} setScore={setScore} />
        ) : (
          <>
            {analyseError && <p className='error'>{analyseError}</p>}
            <Info setTabId={setTabId} customQuery={customQuery} setCustomQuery={setCustomQuery} />
          </>
        )}
      </div>
    </>
  )
}
