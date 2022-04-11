import React, { useMemo } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'ui/atoms/theme/ThemeProvider'
import type { ChainInfo } from 'adapters/secondary/wallet/KeplrWalletGateway'
import { WalletContext } from './context'
import { createWalletStore } from './store/index'
import { WalletView } from './view/walletView'
import type { DeepReadonly } from 'superTypes'

type WalletProps = DeepReadonly<{
  chainId: string
  chainInfo: Array<ChainInfo>
}>

export const Wallet: React.FC<WalletProps> = ({ chainId, chainInfo }: WalletProps) => {
  const walletStore = useMemo(() => createWalletStore(chainInfo), [chainInfo])

  return (
    <ThemeProvider>
      <Provider context={WalletContext} store={walletStore}>
        <WalletView chainId={chainId} />
      </Provider>
    </ThemeProvider>
  )
}
