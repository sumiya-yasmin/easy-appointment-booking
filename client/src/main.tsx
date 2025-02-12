import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { BookSlotPage, HomePage } from './pages'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={ <HomePage />}/>
      <Route path='/book-slot' element={<BookSlotPage/>}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
