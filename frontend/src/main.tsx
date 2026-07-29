import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout-area/layout/layout'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Layout />
    </BrowserRouter>
  </StrictMode>,
)
