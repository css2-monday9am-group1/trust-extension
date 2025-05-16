import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Popup from './components/Popup'
import './index.css'
import { Tooltip } from 'react-tooltip'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Popup />
    <Tooltip id='tooltip' style={{ maxWidth: 'calc(100vw - 44px)', textAlign: 'center' }} />
  </StrictMode>,
)
