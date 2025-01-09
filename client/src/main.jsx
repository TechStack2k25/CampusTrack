import { createRoot } from 'react-dom/client'
import './index.css';
import{ Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import App from './App.jsx'
import { Home, Login, Signup, ForgotPassword, Loading, Notfound, DashboardContent } from './components/index.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store.js';
import Dashboard from './pages/Dashboard.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App/>}>
        <Route path='' element={<Home />}/>
        <Route path='login' element={<Login />}/>
        <Route path='signup' element={<Signup />}/>
        <Route path='forgot-password' element={<ForgotPassword />}/>

        {/* Authenticated access only */}
        <Route  element={<Dashboard/>}>
          <Route path='dashboard' element={<DashboardContent />} />
        </Route>
      </Route>
      <Route path="*" element={<Notfound />} />
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<Loading/>} persistor={persistor}>
      <RouterProvider router={router}/>
    </PersistGate>
  </Provider>
)
