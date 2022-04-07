import React, { useEffect } from 'react'
import { setAddress } from 'domain/faucet/usecase/set-address/setAddress'
import type { AppState as FaucetAppState } from 'domain/faucet/store/appState'
import { useFaucetSelector, useFaucetDispatch } from './FaucetProvider'
import type { DeepReadonly } from 'src/superTypes'

export const App: React.FC = () => {
  const faucetDispatch = useFaucetDispatch()
  const address = useFaucetSelector((state: DeepReadonly<FaucetAppState>) => state.address)

  useEffect(() => {
    faucetDispatch(setAddress('toto'))
  })

  return <div>{address}</div>
}
