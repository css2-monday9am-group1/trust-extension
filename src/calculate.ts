export default async function calculate(prompt: string, response: string) {
  const json = await fetch('https://css2-ai.dynodel.com/trust-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      versions: ['v0.2'],
      prompt,
      response,
      ai: 'chatgpt',
    }),
  }).then((res) => res.json())

  return json as {
    duration: number
    outputs: (
      | {
          version: string
          duration: number
          success: false
          step: string
          error: string
        }
      | {
          version: string
          duration: number
          success: true
          result: {
            aspects: {
              aspect: string
              weighting: number
              score: number
              limitations: number
            }[]
            limitations: {
              limitation: string
              description: string
              occurrence: number
              criticality: number
              encountered: boolean
              penalty: number
            }[]
            score: number
            category: string | null
          }
        }
    )[]
  }
}
