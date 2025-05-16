import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'

export default function Confetti() {
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setAnimating(true)
    }, 100)
  }, [])

  return (
    animating && (
      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight}
        confettiSource={{ x: window.innerWidth / 2, y: window.innerHeight, w: 0, h: 0 }}
        numberOfPieces={100}
        initialVelocityY={{ min: -16, max: -2 }}
        recycle={false}
        tweenDuration={200}
      />
    )
  )
}
