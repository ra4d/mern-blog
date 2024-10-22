import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import store from './app/store.js'
import { presistor } from './app/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import {Provider} from "react-redux"
import './index.css'
import ThemeProvider from './components/ThemeProvider.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
    <PersistGate persistor={presistor}>
      <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
    </PersistGate>
)
