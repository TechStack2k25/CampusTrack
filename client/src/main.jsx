import { createRoot } from 'react-dom/client'
import './index.css';
import{ RouterProvider, createBrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import { Home, Login, Signup, ForgotPassword, Loading, Notfound} from './components/index.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store.js';
import Routers from './Router.jsx';
import Authenticate from './utils/Authenticate.jsx';
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from './api/queryClient.js';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Authenticate><Home /> </Authenticate>},
      { path: 'login', element: <Authenticate><Login /> </Authenticate> },
      { path: 'signup', element: <Authenticate><Signup /> </Authenticate> },
      { path: 'forgot-password/:token?', element: <Authenticate><ForgotPassword /> </Authenticate> },
      { path: '/*', element: <Authenticate auth={true}><Routers /> </Authenticate>},
      { path: '*', element: <Notfound /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<Loading/>} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </PersistGate>
  </Provider>
)
