import React, { useCallback } from 'react'
import { useWalletDispatch } from '../store/index'
import { enableWallet } from 'domain/wallet/usecases/enable-wallet/enableWallet'

type WalletViewProps = Readonly<{ chainId: string }>

export const WalletView: React.FC<WalletViewProps> = ({ chainId }: WalletViewProps) => {
  const dispatch = useWalletDispatch()

  const handleCLick = useCallback(() => {
    dispatch(enableWallet('keplr', chainId))
  }, [chainId, dispatch])

  return <button onClick={handleCLick}>Connect Wallet</button>
}
