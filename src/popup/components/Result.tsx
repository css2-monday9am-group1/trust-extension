import GaugeComponent from 'react-gauge-component'
import calculate from '../../calculate'
import { useState } from 'react'
import { Activity, AlertTriangle, BarChart, ChevronDown, Info } from 'react-feather'
import './result.css'

interface ResultProps {
  result: Awaited<ReturnType<typeof calculate>>['outputs'][number]
}

export default function Result({ result }: ResultProps) {
  const [showDetails, setShowDetails] = useState(false)

  if (!result.success) {
    return <p className='error'>{result.error}</p>
  }

  const output = result.result

  return (
    <div className='result'>
      <div className='aspects'>
        {output.aspects.map((aspect) => (
          <div key={aspect.aspect}>
            <h3>{aspect.aspect}</h3>
            {/* <p>weighting: {aspect.weighting.toFixed(2)}</p> */}
            <GaugeComponent
              value={aspect.score}
              type='radial'
              style={{ width: 130 }}
              marginInPercent={0.023}
              labels={{
                valueLabel: {
                  style: { fill: '#000000', textShadow: 'none', fontSize: aspect.score === 100 ? 48 : 38 },
                  maxDecimalDigits: 1,
                },
                tickLabels: {
                  hideMinMax: true,
                },
              }}
              arc={{
                subArcs: [
                  { color: '#ea4228' },
                  { color: '#ff8e32' },
                  { color: '#ffc61e' },
                  { color: '#f7ec20' },
                  { color: '#85e814' },
                ],
                padding: 0.02,
                width: 0.2,
              }}
            />
          </div>
        ))}
      </div>

      <div className='details' onClick={() => setShowDetails(!showDetails)} data-enabled={showDetails}>
        <Activity size={18} strokeWidth={2} />
        <p>{showDetails ? 'Hide' : 'Show More'} Details</p>
        <ChevronDown size={14} strokeWidth={2} />
      </div>

      {showDetails && (
        <>
          <div className='category'>
            <p>
              Identified category
              <Info
                size={12}
                data-tooltip-id='tooltip'
                data-tooltip-content='The category is used to determine how different aspects of trust are weighted in the final score.'
              />
            </p>
            <h3>{output.category || 'N/A'}</h3>
          </div>

          <div className='limitations'>
            <h3>Score Penalties</h3>

            {output.limitations.filter((limitation) => limitation.encountered).length === 0 && (
              <p style={{ margin: 0 }}>There were no penalties found for this response.</p>
            )}

            {output.limitations
              .filter((limitation) => limitation.encountered)
              .map((limitation) => (
                <div key={limitation.limitation} className='limitation'>
                  <div className='head'>
                    <h4>
                      {limitation.limitation}
                      <Info size={12} data-tooltip-id='tooltip' data-tooltip-content={limitation.description} />
                    </h4>
                    <p>
                      <strong style={{ color: `hsl(0deg 100% ${Math.round(limitation.penalty * 40)}%)` }}>
                        -{limitation.penalty.toFixed(2)}
                      </strong>{' '}
                      penalty
                    </p>
                  </div>
                  <Occurrence value={limitation.occurrence} />
                  <Criticality value={limitation.criticality} />
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}

function Occurrence({ value }: { value: number }) {
  const term =
    value < 2 ? 'very likely' : value < 4 ? 'likely' : value < 6 ? 'possible' : value < 8 ? 'unlikely' : 'very unlikely'
  const color = `hsl(50deg 100% ${Math.round(value * 3)}%)`

  return (
    <div className='stat'>
      <BarChart size={14} stroke={color} />
      <p style={{ color }}>Considered {term} to occur</p>
      {value < 4 && <p>- penalty</p>}
      {value >= 4 && <p>+ penalty</p>}
    </div>
  )
}

function Criticality({ value }: { value: number }) {
  const term = value < 2 ? 'not' : value < 4 ? 'minimally' : value < 6 ? 'moderately' : value < 8 ? 'very' : 'highly'
  const color = `hsl(25deg 100% ${Math.round(value * 3)}%)`

  return (
    <div className='stat'>
      <AlertTriangle size={14} stroke={color} />
      <p style={{ color }}>Considered {term} critical</p>
      {value < 4 && <p>- penalty</p>}
      {value < 8 && value >= 4 && <p>+ penalty</p>}
      {value >= 8 && <p>++ penalty</p>}
    </div>
  )
}
