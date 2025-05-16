import calculate from '../../calculate'
import { useState } from 'react'
import Result from './Result'
import Confetti from './Confetti.js'

interface ResultsProps {
  data: Awaited<ReturnType<typeof calculate>> & { error?: string }
  setScore: (score: number) => void
}

export default function Results({ data: { error, outputs = [] }, setScore }: ResultsProps) {
  const [outputIndex, setOutputIndex] = useState(0)
  setScore((outputs[outputIndex]?.success && outputs[outputIndex].result.score) || NaN)

  const confetti = outputs.some((result) => result.success && result.result.score >= 95)

  if (error) {
    return <p className='error'>Error: {error}</p>
  }

  return (
    <>
      {outputs.length > 1 && (
        <>
          <div className='tabs'>
            {outputs.map((output, i) => (
              <p key={output.version} onClick={() => setOutputIndex(i)} data-selected={outputIndex === i}>
                <strong>{output.version}</strong>
              </p>
            ))}
          </div>
        </>
      )}

      <Result result={outputs[outputIndex]} />

      {confetti && <Confetti />}
    </>
  )
}
