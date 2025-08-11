// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { Provider as LangContextProvider } from './context/LangContext.jsx'
import { store } from '../app/store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
      <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                  <LangContextProvider>
                        <App />
                  </LangContextProvider>
            </QueryClientProvider>
      </Provider>
);
