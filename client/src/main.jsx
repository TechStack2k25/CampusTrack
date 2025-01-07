import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import{ Route,RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import App from './App.jsx'
import { Home, Login, Signup, ForgotPassword } from './components/index.js';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
       <Route path='' element={<Home />}/>
       <Route path='login' element={<Login />}/>
       <Route path='signup' element={<Signup />}/>
       <Route path='forgot-password' element={<ForgotPassword />}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router}/>
  </StrictMode>,
)
