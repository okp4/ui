import React, { useMemo } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'ui/atoms/theme/ThemeProvider'
import { FaucetContext, WalletContext } from './context'
import { createFaucetStore, createWalletStore } from './store/index'
import { FaucetView } from './view/FaucetView'
import type { DeepReadonly } from '../../../superTypes'

type FaucetProps = DeepReadonly<{
  chainId: string
  faucetUrl: string
  chainInfo: Array<Record<string, unknown>>
}>

export const Faucet: React.FC<FaucetProps> = ({ faucetUrl, chainId, chainInfo }: FaucetProps) => {
  const faucetStore = useMemo(() => createFaucetStore(faucetUrl), [faucetUrl])
  const walletStore = useMemo(() => createWalletStore(chainInfo), [chainInfo])

  return (
    <ThemeProvider>
      <Provider context={FaucetContext} store={faucetStore}>
        <Provider context={WalletContext} store={walletStore}>
          <FaucetView chainId={chainId} />
        </Provider>
      </Provider>
    </ThemeProvider>
  )
}
