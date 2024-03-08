import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import MainContextApiProvider from './contextapi/mainapi.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <MainContextApiProvider>
    <App />
  </MainContextApiProvider>
)
