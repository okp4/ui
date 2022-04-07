import React from 'react'
import { FaucetProvider } from './FaucetProvider'
import { App } from './App'

export const Faucet: React.FC = () => {
  return (
    <FaucetProvider>
      <App />
    </FaucetProvider>
  )
}
