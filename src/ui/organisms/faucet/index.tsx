import React, { useMemo } from 'react'
import { Provider } from 'react-redux'
import type { ChainInfo } from 'adapters/secondary/wallet/KeplrWalletGateway'
import { initEventListeners } from 'adapters/primary/faucet/eventListeners'
import { ThemeProvider } from 'ui/atoms/theme/ThemeProvider'
import { FaucetContext } from './context'
import { createFaucetStore } from './store/index'
import { FaucetView } from './view/FaucetView'
import { Wallet } from '../wallet'
import type { DeepReadonly } from 'superTypes'

type FaucetProps = DeepReadonly<{
  chainId: string
  faucetUrl: string
  chainInfo: Array<ChainInfo>
}>

export const Faucet: React.FC<FaucetProps> = ({ faucetUrl, chainId, chainInfo }: FaucetProps) => {
  const faucetStore = useMemo(() => createFaucetStore(faucetUrl), [faucetUrl])
  initEventListeners(faucetStore)
  return (
    <ThemeProvider>
      <Provider context={FaucetContext} store={faucetStore}>
        <Wallet chainId={chainId} chainInfo={chainInfo} />
        <FaucetView chainId={chainId} />
      </Provider>
    </ThemeProvider>
  )
}
